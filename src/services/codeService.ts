import { createHmac } from 'crypto'
import { ApiError } from '../utils/responseError'

const hash_secret = process.env.ENV_HASH_SALT;

export const generateCodewithToken = (): { code: string, token: string } => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = createHmac('sha256', hash_secret).update(`${code}`).digest('hex');
    return { code, token };
}

export const verifyCodewithHash = (contact: string, code: string, hash: string) => {

}