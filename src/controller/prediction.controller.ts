import { Request, Response } from "express";
import response from "../utils/response";
import inferenceService from "../utils/inference";

export default {
  async predict(req: Request, res: Response) {
    const { imageUrl } = req.body as { imageUrl?: string };

    if (!imageUrl || typeof imageUrl !== "string") {
      return response.error(
        res,
        { code: 400 },
        "The 'imageUrl' field is required in the request body."
      );
    }

    try {
      // 1. Ambil gambar dari URL yang diberikan
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(
          `Failed to fetch image from URL. Status: ${imageResponse.status}`
        );
      }

      // 2. Konversi respons gambar menjadi Buffer
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      // 3. Jalankan prediksi menggunakan buffer gambar
      const result = await inferenceService.predict(imageBuffer);
      response.success(res, result, "Prediction successful");
    } catch (error) {
      console.error(error); // Log error asli untuk debugging
      const errorMessage =
        error instanceof Error ? error.message : "Prediction failed";
      response.error(res, { code: 500 }, errorMessage);
    }
  },
};
