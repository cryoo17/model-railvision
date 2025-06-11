"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
cloudinary_1.v2.config({
    cloud_name: env_1.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.CLOUDINARY_API_KEY,
    api_secret: env_1.CLOUDINARY_API_SECRET,
});
const toDataURL = (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURL = `data:${file.mimetype};base64,${b64}`;
    return dataURL;
};
const getPublicIdFromFileUrl = (fileUrl) => {
    const fileNameUsingSubstring = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const publicId = fileNameUsingSubstring.substring(0, fileNameUsingSubstring.lastIndexOf("."));
    return publicId;
};
exports.default = {
    uploadSingle(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileDataURL = toDataURL(file);
            const result = yield cloudinary_1.v2.uploader.upload(fileDataURL, {
                resource_type: "auto",
            });
            return result;
        });
    },
    uploadMultiple(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadBatch = files.map((item) => {
                const result = this.uploadSingle(item);
                return result;
            });
            const results = yield Promise.all(uploadBatch);
            return results;
        });
    },
    remove(fileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicId = getPublicIdFromFileUrl(fileUrl);
            const result = yield cloudinary_1.v2.uploader.destroy(publicId);
            return result;
        });
    },
};
