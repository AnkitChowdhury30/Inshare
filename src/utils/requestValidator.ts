import { HttpRequest } from "@azure/functions";
import { RequestAddBroker, RequestAddInteresed, RequestAddLead, RequestAddProperty, RequestAdminLoginWithOtp, RequestBeBroker, RequestCreateBox, RequestDeleteProperty, RequestGetAllData, RequestGetAllProperties, RequestGetMyProperties, RequestLoginLinkWhatsapp, RequestLoginWithOtp, RequestLogout, RequestOtpWhatsapp, RequestUpdateProperty } from "../types/request";
import { ApiError } from "./responseError";
import { PropertyStatus, PropertyZones } from "../types/types";
import { ObjectId } from "mongodb";
import { DeleteAfterOptions } from "./constants";

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
        throw ApiError.InvalidFieldType("[deleteAfter] must be a valid option ${}");
    }

    return {
        data,
        deleteAfter,
        description,
        name,
        ownerEmail,
        ownerName,
        password
    };
};

export const validateRequestGetAllProperties = async (req: HttpRequest): Promise<RequestGetAllProperties> => {
    // extract the body of the request
    const { } = await req.json() as RequestGetAllProperties;

    // validate the request body



    return {
    } as RequestGetAllProperties;
}

export const validateRequestBeBroker = async (req: HttpRequest): Promise<RequestBeBroker> => {
    // extract the body of the request
    const { name, phone } = await req.json() as RequestBeBroker;

    // validate the request body
    if (!name || typeof name !== "string") {
        throw ApiError.InvalidFieldType("Name is required and must be a string");
    }

    const _phone = normalizeIndianPhoneNumber(phone, "[phone] number");


    return {
        name,
        phone: _phone
    };
}

export const validateRequestOtpWhatsapp = async (req: HttpRequest): Promise<RequestOtpWhatsapp> => {
    // extract the body of the request
    const { phone } = await req.json() as RequestOtpWhatsapp;

    // validate the request body
    const _phone = normalizeIndianPhoneNumber(phone, "[phone] number");


    return {
        phone: _phone
    };
}

export const validateRequestLoginWithOtp = async (req: HttpRequest): Promise<RequestLoginWithOtp> => {
    // extract the body of the request
    const { hash, otp, phone } = await req.json() as RequestLoginWithOtp;

    // validate the request body
    if (!hash || typeof hash !== "string") {
        throw ApiError.MissingField("[hash] is required and must be a string");
    }
    if (!otp || typeof otp !== "string") {
        throw ApiError.MissingField("[OTP] is required and must be string");
    }

    const _phone = normalizeIndianPhoneNumber(phone, "[phone] number");

    return {
        hash, otp, phone: _phone
    };
}

export const validateRequestLoginLinkWhatsapp = async (req: HttpRequest): Promise<RequestLoginLinkWhatsapp> => {
    // extract the body of the request
    const { number } = await req.json() as RequestLoginLinkWhatsapp;

    // validate the request body
    if (!number || typeof number !== "string") {
        throw ApiError.MissingField("Provide your registered number to get login link on whatsapp");
    }

    return {
        number
    } as RequestLoginLinkWhatsapp;
}

export const validateRequestAdminLoginWithOtp = async (req: HttpRequest): Promise<RequestAdminLoginWithOtp> => {
    // extract the body of the request
    const { hash, otp, phone } = await req.json() as RequestAdminLoginWithOtp;

    // validate the request body
    if (!hash || typeof hash !== "string") {
        throw ApiError.MissingField("[hash] is required and must be a string");
    }
    if (!otp || typeof otp !== "string") {
        throw ApiError.MissingField("[otp] is required");
    }
    const _phone = normalizeIndianPhoneNumber(phone, "[phone] number");


    return {
        hash, otp, phone: _phone
    };
}

//=============================================================

/**
 * Broker Routes Validators
 * 1. RequestGetMyProperties
 * 2. RequestAddInterested
 * 3. RequestAddLead
 * 4. RequestAddLeadToProperty
 */


export const validateRequestGetMyProperties = async (req: HttpRequest): Promise<RequestGetMyProperties> => {
    // extract the body of the request
    const { } = await req.json() as RequestGetMyProperties;

    // validate the request body

    return {

    } as RequestGetMyProperties;
}

export const validateRequestAddInterested = async (req: HttpRequest): Promise<RequestAddInteresed> => {
    // extract the body of the request
    const { p_id } = await req.json() as RequestAddInteresed;

    // validate the request body
    if (!p_id || typeof p_id !== "string" || !ObjectId.isValid(p_id)) {
        throw ApiError.InvalidFieldType("[p_id] is required and must be a valid ObjectId string");
    }

    return {
        p_id
    };
}

export const validateRequestAddLead = async (req: HttpRequest): Promise<RequestAddLead> => {
    // extract the body of the request
    const { name, p_id, price } = await req.json() as RequestAddLead;


    if (!p_id || !ObjectId.isValid(p_id)) {
        throw ApiError.InvalidFieldType("[p_id] is required and must be a valid ObjectId string");
    }

    if (!name || typeof name !== "string") {
        throw ApiError.InvalidFieldType("[name] must be a string");
    }

    if (!price || typeof price !== "number") {
        throw ApiError.InvalidFieldType("[price] must be a number");
    }

    return { name, p_id, price };
}


export const validateRequestLogout = async (req: HttpRequest): Promise<RequestLogout> => {
    // extract the body of the request
    const { all } = await req.json() as RequestLogout;

    // validate the request body


    return {
        all
    };
}
//=============================================================

/**
 * Admin Routes Validators
 * 1. RequestAddBroker
 * 2. RequestAddProperty
 * 3. RequestUpdateProperty
 * 4. RequestDeleteProperty
 * 5. RequestGetAllData
 */

export const validateRequestAddBroker = async (req: HttpRequest): Promise<RequestAddBroker> => {
    // extract the body of the request
    const { name, addr, b_email, b_phone } = await req.json() as RequestAddBroker;

    // validate the request body
    const _phone = normalizeIndianPhoneNumber(b_phone, "[b_phone] phone no.");

    if (!b_email || !emailRegex.test(b_email)) {
        throw ApiError.InvalidFieldType("[b_email] email is required and must be valid email");
    }

    // Optionally check details
    if (!name || typeof name !== "string") {
        throw ApiError.InvalidFieldType("[name] name must be a string");
    }

    if (addr && typeof addr !== "string") {
        throw ApiError.InvalidFieldType("[addr] address must be a string");

    }

    return {
        name, addr: addr || "", b_email, b_phone: _phone
    } as RequestAddBroker;
}

export const validateRequestAddProperty = async (req: HttpRequest): Promise<RequestAddProperty> => {
    // extract the body of the request
    const { p_status, p_details, p_zone, exp_price } = await req.json() as RequestAddProperty;

    // validate the request body
    if (!exp_price || typeof exp_price !== "number") {
        throw ApiError.InvalidFieldType("[exp_price] is required")
    }
    if (!p_status || !allowedPropertyStatus.includes(p_status)) {
        throw ApiError.InvalidFieldType("[p_status] property status is required and must be a valid value");
    }

    if (!p_zone || !allowedPropertyZones.includes(p_zone)) {
        throw ApiError.InvalidFieldType("[p_zone] zone is required and must be a valid zone");
    }

    if (!p_details || typeof p_details !== "object") {
        throw ApiError.InvalidFieldType("[p_details] property details is required and must be a object");
    }

    // Optionally check details
    if (p_details.name && typeof p_details.name !== "string") {
        throw ApiError.InvalidFieldType("[p_details.name] name must be a string");
    }

    if (p_details.addr && typeof p_details.addr !== "string") {
        throw ApiError.InvalidFieldType("[p_details.addr] address must be a string");

    }

    if (p_details.img && !Array.isArray(p_details.img)) {
        throw ApiError.InvalidFieldType("[p_details.img] image must be a url string");
    }

    return {
        p_status, p_zone, p_details, exp_price
    };
}

export const validateRequestUpdateProperty = async (req: HttpRequest): Promise<RequestUpdateProperty> => {
    // extract the body of the request
    const { p_id, p_details, p_status, p_zone, exp_price } = await req.json() as RequestUpdateProperty;

    // validate the request body

    if (!exp_price || typeof exp_price !== "number") {
        throw ApiError.InvalidFieldType("[exp_price] is required")
    }

    if (!p_id || typeof p_id !== "string" || !ObjectId.isValid(p_id)) {
        throw ApiError.MissingField("[p_id] is required and must be valid string");
    }

    if (p_status && !allowedPropertyStatus.includes(p_status)) {
        throw ApiError.InvalidFieldType("[p_status] property status value is incorrect");
    }

    if (p_zone && !allowedPropertyZones.includes(p_zone)) {
        throw ApiError.InvalidFieldType("[p_zone] value is incorrect");
    }

    if (p_details) {
        if (typeof p_details !== "object") {
            throw ApiError.InvalidFieldType("[p_details] must be an object");
        }

        if (p_details.name && typeof p_details.name !== "string") {
            throw ApiError.InvalidFieldType("[p_details.name] must be a string");
        }

        if (p_details.addr && typeof p_details.addr !== "string") {
            throw ApiError.InvalidFieldType("[p_details.addr] must be a string");
        }

        if (p_details.img && !Array.isArray(p_details.img)) {
            throw ApiError.InvalidFieldType("[p_details.img] must be an array of strings");
        }
    }

    return {
        p_id, p_details, p_status, p_zone, exp_price
    } as RequestUpdateProperty;
}

export const validateRequestDeleteProperty = async (req: HttpRequest): Promise<RequestDeleteProperty> => {
    // extract the body of the request
    const { p_id } = await req.json() as RequestDeleteProperty;

    // validate the request body

    if (!p_id || typeof p_id !== "string" || !ObjectId.isValid(p_id)) {
        throw ApiError.MissingField("[p_id] is required and must be valid string");
    }


    return {
        p_id
    };
}


export const validateRequestGetAllData = async (req: HttpRequest): Promise<RequestGetAllData> => {
    // extract the body of the request
    const { } = await req.json() as RequestGetAllData;

    // validate the request body

    return {

    } as RequestGetAllData;
}
//=============================================================
