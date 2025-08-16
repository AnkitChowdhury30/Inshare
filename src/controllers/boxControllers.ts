import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateRequestCreateBox, validateRequestGetBox } from "../utils/requestValidator";
import { connectToDb } from "../services/dbService";
import { dbSchema, DeleteAfterOptions } from "../utils/constants";
import { Box } from "../types/types";
import { ResponseCreateBox, ResponseGetBox } from "../types/response";
import { responseSuccess } from "../utils/responseSuccess";
import { generateCodewithToken } from "../services/codeService";
import { ApiError, makeErrorFromCatch } from "../utils/responseError";

export const controllerRequestCreateBox = async (
    req: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> => {
    try {
        const { data, deleteAfter, description, name, ownerEmail, ownerName, password } = await validateRequestCreateBox(req);


        const db = await connectToDb();

        // generate a unique code for the box
        const { code, token } = generateCodewithToken();

        // prepare box object
        const box: Omit<Box, "_id"> = {
            data,
            code,
            deleteAfter: new Date(Date.now() + DeleteAfterOptions[deleteAfter as string]),
            description,
            name,
            ownerEmail,
            ownerName,
            password,
            createdAt: new Date(),
            updatedAt: new Date()
        };



        // insert box doc
        const result = await db.collection(dbSchema.BOX).insertOne(box);
        if (!result.acknowledged) {
            throw new Error("Failed to create box");
        }

        return responseSuccess<ResponseCreateBox>({
            status: "SUCCESS",
            code,
            token

        });

    } catch (error) {
        return makeErrorFromCatch(error);
    }
};

// GetBox
export const controllerRequestGetBox = async (
    req: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> => {
    try {
        const { code, password } = await validateRequestGetBox(req);
        if (!code) {
            throw new Error("Code is required");
        }

        const db = await connectToDb();

        // find box by code
        const box = await db.collection(dbSchema.BOX).findOne({ code }) as unknown as Box;
        if (!box) {
            throw ApiError.BoxNotExist("Box does not exist");
        }

        if (box.password && !password) {
            throw ApiError.MissingField("[password] is required for this box");
        }
        // check password if provided
        if (password && box.password !== password) {
            throw ApiError.InvalidPassword("Password does not match");
        }

        return responseSuccess<ResponseGetBox>({
            status: "SUCCESS",
            ...box
        });

    } catch (error) {
        return makeErrorFromCatch(error);
    }
};