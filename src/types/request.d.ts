import { Box } from "./types";

export type RequestCreateBox = Omit<Box, '_id' | 'createdAt' | 'updatedAt' | 'code'>;

export type RequestUpdateBox = RequestCreateBox & {
    token: string;
}

export type RequestGetBox = {
    code: string;
    password?: string;
};