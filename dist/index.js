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
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./routes/api"));
const body_parser_1 = __importDefault(require("body-parser"));
const route_1 = __importDefault(require("./docs/route"));
const cors_1 = __importDefault(require("cors"));
const inference_1 = __importDefault(require("./utils/inference"));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const result = await db();
            // console.log("Database status: ", result);
            yield inference_1.default.loadModel();
            const app = (0, express_1.default)();
            const PORT = 3000;
            app.use((0, cors_1.default)());
            app.use(body_parser_1.default.json());
            app.get("/", (req, res) => {
                res.status(200).json({
                    message: "Server is running",
                    data: null,
                });
            });
            app.use("/api", api_1.default);
            (0, route_1.default)(app);
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
init();
