import { Box, ErrorType } from "./types";

export type ResponseSuccess = {
    status: "SUCCESS"
}
export type ResponseCreateBox = ResponseSuccess & {
    code: string;
    token: string;
};

export type ResponseUpdateBox = ResponseSuccess;

export type ResponseGetBox = ResponseSuccess & Box;

/** Error Response Types **/
export type ResponseError = {
    status: "ERROR";
    error: ErrorType;
    message: string;
};