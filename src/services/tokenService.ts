import { createHmac } from "crypto";
import { ApiError } from "../utils/responseError";

const hash_secret = process.env.ENV_HASH_SALT;

export const createToken = (s_id: string): string => {
    const hash = createHmac('sha256', hash_secret).update(s_id).digest('hex');
    return `${s_id}${hash}`;
}

export const verifyToken = (token: string): string => {
    const s_id = token.substring(0, 24);
    const hash = token.substring(24);

    const counterHash = createHmac('sha256', hash_secret).update(s_id).digest('hex');
    if (hash !== counterHash) {
        throw ApiError.Unauthenticated("incorrect token");
    }

    return s_id;
}