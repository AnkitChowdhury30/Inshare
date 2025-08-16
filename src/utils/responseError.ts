import { HttpResponseInit } from "@azure/functions";
import { ErrorType } from '../types/types';
import { ResponseError } from "../types/response";

// ApiError class to handle API errors
export class ApiError extends Error {
    public statusCode: number;
    public errorType: ErrorType;
    public errorMessage: string;

    constructor(status: number, error: ErrorType, message: string) {
        super(message);
        this.statusCode = status;
        this.errorType = error;
        this.errorMessage = message;
        this.name = 'ApiError';
    }

    // Unauthenticated error
    static Unauthenticated(msg = "Please login to continue"): ApiError {
        return new ApiError(401, 'UNAUTHORIZED', msg);
    }



    // missing field error
    static MissingField(message: string): ApiError {
        return new ApiError(400, 'MISSING_FIELD', message);
    }

    // Invalid Type error
    static InvalidFieldType(message: string): ApiError {
        return new ApiError(400, 'INVALID_FIELD_TYPE', message);
    }

    // Box not exist
    static BoxNotExist(msg = "Provide a valid box number"): ApiError {
        return new ApiError(404, 'BOX_NOT_EXIST', msg);
    }

    // Internal Server Error
    static InternalError(message: string): ApiError {
        return new ApiError(500, 'INTERNAL_ERROR', message);
    }

}


// Error Factory
export const makeErrorFromCatch = (error: unknown): HttpResponseInit => {
    // Custom API Error
    if (error instanceof ApiError) {
        return {
            status: error.statusCode,
            jsonBody: {
                status: "ERROR",
                error: error.errorType,
                message: error.message
            }
        } as { status: number; jsonBody: ResponseError }
    }

    // Default Error
    console.error("❌ Unhandled error:", error);
    return {
        status: 500,
        jsonBody: {
            status: "ERROR",
            error: "INTERNAL_ERROR" as ErrorType,
            message: "Internal server error"
        }
    } as { status: number; jsonBody: ResponseError }
};