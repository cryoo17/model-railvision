"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const tf = __importStar(require("@tensorflow/tfjs-node"));
const path_1 = __importDefault(require("path"));
// Cache modelnya di memori agar tidak perlu load berulang kali
let model = null;
// Tentukan label kelas sesuai urutan output model Anda
// GANTI INI DENGAN LABEL ANDA YANG SEBENARNYA
const CLASS_LABELS = ["SANGAT_PADAT", "CUKUP_PADAT", "TIDAK_PADAT"];
/**
 * Memuat model TensorFlow.js dari file sistem.
 * Model akan di-cache setelah pemuatan pertama.
 */
function loadModel() {
    return __awaiter(this, void 0, void 0, function* () {
        if (model) {
            return;
        }
        try {
            const modelPath = path_1.default.resolve(__dirname, "../models/tf-model/model.json");
            console.log(`Loading model from: file://${modelPath}`);
            const loadedModel = yield tf.loadGraphModel(`file://${modelPath}`);
            model = loadedModel;
            console.log("Model loaded successfully.");
        }
        catch (error) {
            console.error("Failed to load model:", error);
            throw new Error("Could not load the machine learning model.");
        }
    });
}
/**
 * Melakukan prediksi pada buffer gambar yang diberikan.
 * @param imageBuffer Buffer dari file gambar (misal: dari req.file.buffer).
 * @returns Hasil prediksi termasuk label, confidence, dan skor semua kelas.
 */
function predict(imageBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        // Pastikan model sudah dimuat
        yield loadModel();
        if (!model) {
            throw new Error("Model is not loaded, prediction cannot proceed.");
        }
        try {
            // tf.tidy() untuk membersihkan tensor dari memori secara otomatis
            const result = tf.tidy(() => {
                // 1. Decode gambar dari buffer menjadi tensor
                const tensor = tf.node.decodeImage(imageBuffer, 3).toFloat();
                // 2. Resize gambar ke ukuran yang diharapkan oleh model (224x224)
                const resized = tf.image.resizeBilinear(tensor, [224, 224]);
                // 3. Normalisasi piksel gambar (misalnya, dari [0, 255] menjadi [0, 1])
                const normalized = resized.div(tf.scalar(255.0));
                // 4. Tambahkan batch dimension agar sesuai dengan input shape model [-1, 224, 224, 3]
                const expanded = normalized.expandDims(0);
                // 5. Jalankan prediksi
                const prediction = model.predict(expanded);
                // 6. Dapatkan data hasil prediksi (array probabilitas)
                const scores = prediction.dataSync();
                const scoresArray = Array.from(scores);
                // 7. Cari index dengan probabilitas tertinggi
                const maxScoreIndex = prediction.as1D().argMax().dataSync()[0];
                // 8. Dapatkan label dan confidence-nya
                const label = CLASS_LABELS[maxScoreIndex];
                const confidence = scores[maxScoreIndex];
                return {
                    label,
                    confidence,
                    allScores: scoresArray.map((score, index) => ({
                        label: CLASS_LABELS[index],
                        score,
                    })),
                };
            });
            return result;
        }
        catch (error) {
            console.error("Error during prediction:", error);
            throw new Error("An error occurred while processing the image.");
        }
    });
}
exports.default = {
    predict,
    loadModel, // Opsional: ekspor untuk pre-loading saat server start
};
