"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API Railvision",
        description: "Dokumentasi API Railvision",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        },
        {
            url: "https://back-end-railvision.vercel.app/api",
            description: "Deploy Server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
    },
};
const outputFile = "./swagger_output.json";
const endpointsFile = ["../routes/api.ts"];
(0, swagger_autogen_1.default)({ openapi: "3.0.0" })(outputFile, endpointsFile, doc);
