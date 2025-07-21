import CryptoJs from 'crypto-js';
import { Buffer } from 'buffer/';
import { APICalls } from './types';

const instance: {
    enabled: boolean,
    publicKey: CryptoKey | null,
    privateKey: CryptoKey | null,
    serverPublicKey: CryptoKey | null,
    serverPublicKeyString: string,
} = {
    enabled: false,
    publicKey: null,
    privateKey: null,
    serverPublicKey: null,
    serverPublicKeyString: '',
}

export const getInstance = () => {
    return instance;
}

export const enable = (publicKey: CryptoKey, privateKey: CryptoKey, enabled?: boolean, serverPublicKey?: string) => {
    if (enabled) {
        instance.enabled = enabled;
    } else {
        instance.enabled = true;
    }
    instance.publicKey = publicKey;
    instance.privateKey = privateKey;
    if (serverPublicKey) {
        instance.serverPublicKeyString = serverPublicKey;
    } else {
        fetch(APICalls.PublicKey, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.text())
            .then(data => {
                const decodedPem = Buffer.from(data, 'base64').toString('utf-8');
                const pemHeader = "-----BEGIN PUBLIC KEY-----\n";
                const pemFooter = "-----END PUBLIC KEY-----\n";
                const pemContents = decodedPem.substring(pemHeader.length, decodedPem.length - pemFooter.length);
                const buffer = Buffer.from(pemContents, 'base64');
                window.crypto.subtle.importKey(
                    'spki',
                    buffer,
                    {
                        name: 'RSA-OAEP',
                        hash: 'SHA-256',
                    },
                    true,
                    ['encrypt']
                ).then(key => {
                    instance.serverPublicKey = key;
                }).catch(error => {
                    console.error('Error importing server public key:', error);
                });
            });
    }
}


function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}


export const encryptForServer = async (plaintext: string): Promise<string> => {
    if (!instance.enabled)
        return plaintext;
    const encodedData = new TextEncoder().encode(plaintext);
    if (!instance.publicKey || !instance.serverPublicKey) {
        throw new Error('Public key is not set');
    }

    const arrayBuffer = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        instance.serverPublicKey,
        encodedData
    );
    const encryptedData = Buffer.from(arrayBuffer).toString('base64');
    let exported = await window.crypto.subtle.exportKey('spki', instance.publicKey);
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pem = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    const pemBase64 = window.btoa(pem);
    return JSON.stringify({ payload: encryptedData, publicKey: pemBase64, signature: "base64" });
};


export const decryptFromServer = async (encryptedData: string): Promise<string> => {
    if (!instance.enabled)
        return encryptedData;
    if (!instance.privateKey)
        throw new Error('Public key is not set');
    const encryptedArrayBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0)).buffer;
    let decryptedData;
    try {
        decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            instance.privateKey,
            encryptedArrayBuffer
        );
    } catch (error) {
        console.error('Error decrypting data:', error);
        throw new Error('Decryption failed');
    }
    const decodedData = new TextDecoder().decode(decryptedData);
    return decodedData;
};

export const encryptForChannel = async (plaintext: string, aesKey: string): Promise<string> => {
    if (!instance.enabled)
        return plaintext;

    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await window.crypto.subtle.importKey(
        'raw',
        Buffer.from(aesKey, 'base64'),
        'AES-CBC',
        false,
        ['encrypt']
    );

    const encodedData = new TextEncoder().encode(plaintext);
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: 'AES-CBC',
            iv: iv,
        },
        key,
        encodedData
    );

    const payload = Buffer.from(encryptedData).toString('base64');
    const ivBase64 = Buffer.from(iv).toString('base64');

    return JSON.stringify({ payload, iv: ivBase64 });
};

export const decryptFromChannel = async (json: string, aesKey: string): Promise<string> => {
    const { payload, iv } = JSON.parse(json);

    const key = await window.crypto.subtle.importKey(
        'raw',
        Buffer.from(aesKey, 'base64'),
        'AES-CBC',
        false,
        ['decrypt']
    );

    const ivArray = Buffer.from(iv, 'base64');
    const encryptedData = Buffer.from(payload, 'base64');

    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            iv: ivArray,
        },
        key,
        encryptedData
    );

    return new TextDecoder().decode(decryptedData);
};

export const generateAESKey = async (keySize: number = 256): Promise<CryptoKey> => {
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: keySize,
        },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
};

export const exportAESKey = async (key: CryptoKey) => {
    const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    return Buffer.from(exportedKey).toString('base64')
}

export const generateRSAKeyPair = async (): Promise<CryptoKeyPair> => {
    let keypair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
    );
    return keypair;
};


