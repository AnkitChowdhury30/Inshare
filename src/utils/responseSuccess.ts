import { HttpResponseInit } from "@azure/functions";

export function responseSuccess<T extends object>(body: T, statusCode = 200): HttpResponseInit {

    return {
        status: statusCode,
        jsonBody: body,
    };
}