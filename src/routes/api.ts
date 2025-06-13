import express from "express";
import mediaMiddleware from "../middlewares/media.middleware";
import mediaController from "../controller/media.controller";
import predictionController from "../controller/prediction.controller";

const router = express.Router();

router.post(
  "/media/upload-single",
  [mediaMiddleware.single("file")],
  mediaController.single
  /**
  #swagger.tags = ["Media"]
  #swagger.requestBody = {
    required: true,
    content: {
      "multipart/form-data": {
        schema : {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary"
            }
          }
        }
      }
    }
  }
  */
);
router.post(
  "/media/upload-multiple",
  [mediaMiddleware.multiple("files")],
  mediaController.multiple
  /**
  #swagger.tags = ["Media"]
  #swagger.requestBody = {
    required: true,
    content: {
      "multipart/form-data": {
        schema : {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      }
    }
  }
  */
);
router.delete(
  "/media/remove",
  mediaController.remove
  /**
  #swagger.tags = ["Media"]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/RemoveMediaRequest"
    }
  }
  */
);

router.post(
  "/predict",
  predictionController.predict
  /**
  #swagger.tags = ["Prediction"]
  #swagger.summary = "Predict image classification using a trained model via Cloudinary URL"
  #swagger.description = "Provide a Cloudinary image URL to get its classification from the ML model."
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Stasiun Gubeng"
            },
            imageUrl: {
              type: "string",
              format: "uri",
              example: "https://res.cloudinary.com/dwoalvumb/image/upload/v1749743039/fkqp9l2acfvumcg0znqs.jpg"
            }
          },
          required: ["name", "imageUrl"]
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Prediction successful",
    schema: {
      type: "object",
      properties: {
        label: { type: "string", example: "SANGAT_PADAT" },
        confidence: { type: "number", example: 0.98 },
        allScores: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              score: { type: "number" }
            }
          }
        }
      }
    }
  }
  */
);

export default router;
