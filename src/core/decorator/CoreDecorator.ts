import {FileInterceptor} from "@nestjs/platform-express";
import {FileNotRecognizedError} from "../error/FileNotRecognizedError";

const AVAILABLE_MIME_TYPES = {
    'image/png': true,
    'image/jpg': true,
    'image/jpeg': true
};

export const ImageUpload = fileName =>
    FileInterceptor(fileName, {
            fileFilter(req: any, file: { fieldname: string; originalname: string; encoding: string; mimetype: string; size: number; destination: string; filename: string; path: string; buffer: Buffer }, callback: (error: (Error | null), acceptFile: boolean) => void): void {
                if (file.mimetype in AVAILABLE_MIME_TYPES) {
                    return callback(
                        null,
                        true
                    );
                }

                return callback(
                    new FileNotRecognizedError(),
                    false
                );
            }
        }
    );

