import CryptoJs from 'crypto-js';
import crypto from 'crypto';
import { Buffer } from 'buffer/';
import dotenv from 'dotenv';
import aes from 'crypto-js/aes';


export class EncryptionUtil {
    private static privateKey: string;
    private static publicKey: string;
    private static serverPublicKey: string;
    private static enabled: boolean;

    async init(): Promise<void> {
        dotenv.config({ path: './frontend/.env.local' });
        EncryptionUtil.privateKey = process.env.PRIVATE_KEY!;
        EncryptionUtil.publicKey = process.env.PUBLIC_KEY!;
        EncryptionUtil.enabled = true;
        const response = await fetch('http://localhost:8080/publicKey');
        EncryptionUtil.serverPublicKey = await response.text();
    }

    isEnabled(): boolean {
        return EncryptionUtil.enabled;
    }

    public encryptForServer(plaintext: string): string {
        if (!EncryptionUtil.enabled)
            return plaintext;

        let buffer = new Buffer(plaintext);
        let encrypted = crypto.publicEncrypt(EncryptionUtil.serverPublicKey, buffer);

        return encrypted.toString('base64');
    }

    public decryptFromServer(cypher: string): string {
        if (!EncryptionUtil.enabled)
            return cypher;

        let buffer = Buffer.from(cypher, 'base64');
        let plaintext = crypto.privateDecrypt(EncryptionUtil.privateKey, buffer);

        return plaintext.toString('utf8')
    }

    public static encryptForChannel(plaintext: string, aesKey: string): string {
        if (!EncryptionUtil.enabled)
            return plaintext;
        let key = CryptoJs.enc.Utf8.parse(aesKey);
        let buffer = new Buffer(plaintext);
        let iv = CryptoJs.lib.WordArray.random(128 / 8);
        return CryptoJs.AES.encrypt(buffer, key, { iv: iv });
    }

    public static decryptFromChannel(json: string, aesKey: string): string {
        if (!EncryptionUtil.enabled)
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
    }
    public static generateRandomAESKey(keySize: number = 256): string {
        // Generate a random key
        const key = CryptoJs.lib.WordArray.random(keySize / 8);
        return key.toString(CryptoJs.enc.Base64);
    }
}