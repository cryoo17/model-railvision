import * as tf from "@tensorflow/tfjs-node";
import path from "path";

// Cache modelnya di memori agar tidak perlu load berulang kali
let model: tf.GraphModel | null = null;

// Tentukan label kelas sesuai urutan output model Anda
// GANTI INI DENGAN LABEL ANDA YANG SEBENARNYA
const CLASS_LABELS = ["TIDAK_PADAT", "CUKUP_PADAT", "SANGAT_PADAT"];

/**
 * Memuat model TensorFlow.js dari file sistem.
 * Model akan di-cache setelah pemuatan pertama.
 */
async function loadModel() {
  if (model) {
    return;
  }
  try {
    const modelPath = path.resolve(__dirname, "../models/tf-model/model.json");
    console.log(`Loading model from: file://${modelPath}`);
    const loadedModel = await tf.loadGraphModel(`file://${modelPath}`);
    model = loadedModel;
    console.log("Model loaded successfully.");
  } catch (error) {
    console.error("Failed to load model:", error);
    throw new Error("Could not load the machine learning model.");
  }
}

/**
 * Melakukan prediksi pada buffer gambar yang diberikan.
 * @param imageBuffer Buffer dari file gambar (misal: dari req.file.buffer).
 * @returns Hasil prediksi termasuk label, confidence, dan skor semua kelas.
 */
async function predict(imageBuffer: Buffer) {
  // Pastikan model sudah dimuat
  await loadModel();
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
      const prediction = model!.predict(expanded) as tf.Tensor;

      // 6. Dapatkan data hasil prediksi (array probabilitas)
      const scores = prediction.dataSync() as Float32Array;
      const scoresArray = Array.from(scores);

      // 7. Cari index dengan probabilitas tertinggi
      const maxScoreIndex = prediction.as1D().argMax().dataSync()[0];

      // 8. Dapatkan label dan confidence-nya
      const label = CLASS_LABELS[maxScoreIndex];
      const confidence = scores[maxScoreIndex];

      return {
        label,
        confidence,
        // allScores: scoresArray.map((score, index) => ({
        //   label: CLASS_LABELS[index],
        //   score,
        // })),
      };
    });

    return result;
  } catch (error) {
    console.error("Error during prediction:", error);
    throw new Error("An error occurred while processing the image.");
  }
}

export default {
  predict,
  loadModel, // Opsional: ekspor untuk pre-loading saat server start
};
