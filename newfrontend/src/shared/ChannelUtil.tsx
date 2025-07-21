import { EncryptionUtil } from './EncryptionUtil';

class ChannelUtil {
    private channelKey: string;

    constructor(channelKey: string) {
        this.channelKey = EncryptionUtil.generateRandomAESKey();
    }

    encryptMessage(message: string): string {
        const encryptedMessage = EncryptionUtil.encryptForChannel(message, this.channelKey);
        return encryptedMessage;
    }

    decryptMessage(encryptedMessage: string): string {
        const decryptedMessage = EncryptionUtil.decryptFromChannel(encryptedMessage, this.channelKey);
        return decryptedMessage;
    }
}

export default ChannelUtil;