import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import docs from "./docs/route";
import cors from "cors";
import inferenceService from "./utils/inference";

async function init() {
  try {
    // const result = await db();
    // console.log("Database status: ", result);

    await inferenceService.loadModel();

    const app = express();

    const PORT = 3000;
    const HOST =
      process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";

    app.use(cors());
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Server is running",
        data: null,
      });
    });

    app.use("/api", router);
    docs(app);

    app.listen(PORT, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
