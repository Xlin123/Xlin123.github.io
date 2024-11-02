import CryptoJs from 'crypto-js';
import { Buffer } from 'buffer/';

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
        fetch('http://localhost:8080/publickey', {
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
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP",
        },
        instance.privateKey,
        encryptedArrayBuffer
    );
    const decodedData = new TextDecoder().decode(decryptedData);
    return decodedData;
};

export const encryptForChannel = (plaintext: string, aesKey: string): string => {
    if (!instance.enabled)
        return plaintext;
    let key = CryptoJs.enc.Utf8.parse(aesKey);
    let buffer = new Buffer(plaintext);
    let iv = CryptoJs.lib.WordArray.random(128 / 8);
    return CryptoJs.AES.encrypt(buffer, key, { iv: iv });
};

export const decryptFromChannel = (json: string, aesKey: string): string => {
    if (!instance.enabled)
        return json;
    let { payload, iv, publicKey } = JSON.parse(json);
    let encrypted = CryptoJs.lib.CipherParams.create({
        ciphertext: CryptoJs.enc.Base64.parse(payload),
        iv: CryptoJs.enc.Hex.parse(iv),
    });
    let decrypted = CryptoJs.AES.decrypt(encrypted, CryptoJs.enc.Utf8.parse(aesKey), {
        keySize: 128 / 8,
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7,
    });
    let plaintext = decrypted.toString(CryptoJs.enc.Utf8);
    return plaintext;
};

export const generateRandomAESKey = (keySize: number = 256): string => {
    const key = CryptoJs.lib.WordArray.random(keySize / 8);
    return key.toString(CryptoJs.enc.Base64);
};

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
