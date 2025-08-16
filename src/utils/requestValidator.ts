import { HttpRequest } from "@azure/functions";
import { ApiError } from "./responseError";
import { DeleteAfterOptions } from "./constants";
import { RequestCreateBox, RequestGetBox } from "../types/request";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
/**
 * validate and normalize phone number
 * accepted formats 
 *      +911234567890
 *      +91 1234 567 890
 *      1234567890
 *      1234-567-890
 *      1234 567 890
 * @param ph phone number
 * @returns phone number 
 */
function normalizeIndianPhoneNumber(ph: string, field = "Phone Number"): string {
    if (!ph) throw ApiError.MissingField(`${field} is required`);
    const phoneRegex = /^(?:\+91\s?|)(\d{4})[\s-]?(\d{3})[\s-]?(\d{3})$/;
    const match = ph.match(phoneRegex);
    if (match) {
        const [, part1, part2, part3] = match;
        return `${part1}${part2}${part3}`; // Reconstruct as 10-digit number
    }
    throw ApiError.InvalidFieldType(`${field} is not valid`);
}


/**
 * =========================================================
 * General Routes Validators
 * 1. RequestCreateBox
 * 2. RequestGetBox
 * =========================================================
 */

export const validateRequestCreateBox = async (req: HttpRequest): Promise<RequestCreateBox> => {
    // extract the body of the request
    const { data, deleteAfter, description, name, ownerEmail, ownerName, password } = await req.json() as RequestCreateBox;

    // validate the request body

    if (!data) {
        throw ApiError.MissingField("[data] is required");
    } else if (!Array.isArray(data)) {
        throw ApiError.InvalidFieldType("[data] must be an array");
    } else {
        data.forEach((message, index) => {
            if (typeof message !== "object") {
                throw ApiError.InvalidFieldType(`[data][${index}] must be a object`);
            }
            if (!message.type) {
                throw ApiError.InvalidFieldType(`[data][${index}].type is required`);
            }

            if (message.type == "text") {
                if (!message.text || typeof message.text !== "string") {
                    throw ApiError.InvalidFieldType(`[data][${index}].text must be a string`);
                }
            } else if (message.type == "file") {
                if (!message.fileName || typeof message.fileName !== "string") {
                    throw ApiError.InvalidFieldType(`[data][${index}].fileName must be a string`);
                }
                if (!message.fileUrl || typeof message.fileUrl !== "string") {
                    throw ApiError.InvalidFieldType(`[data][${index}].fileUrl must be a string`);
                }
                if (!message.type || typeof message.type !== "string") {
                    throw ApiError.InvalidFieldType(`[data][${index}].type must be a string`);
                }
            } else {
                throw ApiError.InvalidFieldType(`[data][${index}].type must be either "text" or "file"`);
            }
        });
    }

    // validate deleteAfter
    if (!deleteAfter || !Object.keys(DeleteAfterOptions).includes(deleteAfter)) {
        throw ApiError.InvalidFieldType("[deleteAfter] must be a valid option ${`}");
    }

    if (description && typeof description !== "string") {
        throw ApiError.InvalidFieldType("[description] must be a string");
    }

    if (name && typeof name !== "string") {
        throw ApiError.InvalidFieldType("[name] must be a string");
    }

    if (ownerEmail && !emailRegex.test(ownerEmail)) {
        throw ApiError.InvalidFieldType("[ownerEmail] must be a valid email address");
    }

    if (ownerName && typeof ownerName !== "string") {
        throw ApiError.InvalidFieldType("[ownerName] must be a string");
    }

    if (password && typeof password !== "string") {
        throw ApiError.InvalidFieldType("[password] must be a string");
    }

    return {
        data,
        deleteAfter,
        description: description || undefined,
        name: name || "Untitled Box",
        ownerEmail: ownerEmail || undefined,
        ownerName: ownerName || undefined,
        password: password || undefined
    };
};

// RequestGetBox
export const validateRequestGetBox = async (req: HttpRequest): Promise<RequestGetBox> => {
    const { code, password } = req.params as RequestGetBox;

    if (!code || typeof code !== "string") {
        throw ApiError.InvalidFieldType("[code] must be a string");
    }

    if (password && typeof password !== "string") {
        throw ApiError.InvalidFieldType("[password] must be a string");
    }

    return { code, password: password || undefined };
};