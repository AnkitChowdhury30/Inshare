import { createHmac } from 'crypto'
import { ApiError } from '../utils/responseError'

const expiresIn = 1000 * 60 * 10; // 10 min
const hash_secret = process.env.ENV_HASH_SALT;

export const generateOTPwithHash = (contact: string): { otp: string, hash: string } => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = (Date.now() + expiresIn).toString();
    const hash = createHmac('sha256', hash_secret).update(`${otp}.${contact}.${ttl}`).digest('hex') + '.' + ttl;
    return { otp, hash };
}

export const verifyOTPwithHash = (contact: string, otp: string, hash: string) => {
    const [_hash, ttl] = hash.split('.');
    // check for OTP_TIMEOUT
    if (Number(ttl) < Date.now()) {
        throw ApiError.OtpTimeout();
    }

    // check otp validity
    const counterHash = createHmac('sha256', hash_secret).update(`${otp}.${contact}.${ttl}`).digest('hex');
    if (_hash !== counterHash) {
        throw ApiError.InvalidOTP();
    }
}