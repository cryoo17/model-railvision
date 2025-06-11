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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const inference_1 = __importDefault(require("../utils/inference"));
exports.default = {
    predict(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { imageUrl } = req.body;
            if (!imageUrl || typeof imageUrl !== "string") {
                return response_1.default.error(res, { code: 400 }, "The 'imageUrl' field is required in the request body.");
            }
            try {
                // 1. Ambil gambar dari URL yang diberikan
                const imageResponse = yield fetch(imageUrl);
                if (!imageResponse.ok) {
                    throw new Error(`Failed to fetch image from URL. Status: ${imageResponse.status}`);
                }
                // 2. Konversi respons gambar menjadi Buffer
                const imageArrayBuffer = yield imageResponse.arrayBuffer();
                const imageBuffer = Buffer.from(imageArrayBuffer);
                // 3. Jalankan prediksi menggunakan buffer gambar
                const result = yield inference_1.default.predict(imageBuffer);
                response_1.default.success(res, result, "Prediction successful");
            }
            catch (error) {
                console.error(error); // Log error asli untuk debugging
                const errorMessage = error instanceof Error ? error.message : "Prediction failed";
                response_1.default.error(res, { code: 500 }, errorMessage);
            }
        });
    },
};
