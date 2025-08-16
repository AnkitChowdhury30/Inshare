import { HttpRequest } from "@azure/functions";
import { verifyToken } from "../services/tokenService";
import { ApiError } from "./responseError";

export const isAdmin = async (req: HttpRequest) => {

}

export const isBroker = async (req: HttpRequest): Promise<string> => {
    // Extract token(priority: header > query param)
    const token =
        req.headers.get("authorization") ||
        req.query.get("token");

    if (!token) {
        throw ApiError.Unauthenticated();
    }

    // Verify token and extract session ID
    let s_id = verifyToken(token);



    return "";
};
