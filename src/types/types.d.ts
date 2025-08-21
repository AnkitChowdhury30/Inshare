import { DeleteAfterOptions } from '../utils/constants';

export type Message = {
    type: 'text' | 'file';
};

export type TextMessage = Message & {
    type: 'text';
    text: string;
};

export type FileMessage = Message & {
    type: 'file';
    fileName: string;
    fileUrl: string;
};

export type Box = {
    _id: string;
    data: Array<TextMessage | FileMessage>;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    deleteAfter: keyof typeof DeleteAfterOptions | Date;
    password?: string;
    name?: string;
    description?: string;
    ownerName?: string;
    ownerEmail?: string;
}

export type ErrorType =
    | "UNAUTHORIZED"
    | "MISSING_FIELD"
    | "INVALID_FIELD_TYPE"
    | "BOX_NOT_EXIST"
    | "PASSWORD_NOT_MATCH"
    | "INTERNAL_ERROR"
    | "INVALID_PASSWORD"
    | "PASSWORD_REQUIRED"