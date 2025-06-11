"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const media_middleware_1 = __importDefault(require("../middlewares/media.middleware"));
const media_controller_1 = __importDefault(require("../controller/media.controller"));
const prediction_controller_1 = __importDefault(require("../controller/prediction.controller"));
const router = express_1.default.Router();
router.post("/media/upload-single", [media_middleware_1.default.single("file")], media_controller_1.default.single
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
router.post("/media/upload-multiple", [media_middleware_1.default.multiple("files")], media_controller_1.default.multiple
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
router.delete("/media/remove", media_controller_1.default.remove
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
router.post("/predict", prediction_controller_1.default.predict
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
          imageUrl: {
            type: "string",
            format: "uri",
            example: "https://res.cloudinary.com/your-cloud/image/upload/v123456/sample.jpg"
          }
        },
        required: ["imageUrl"]
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
exports.default = router;
