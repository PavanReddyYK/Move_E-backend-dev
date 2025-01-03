import express from "express";

import { generatePdfController } from "../src/controller/pdfController.mjs";
import { validate } from "../src/middleware/validator.mjs";

let routes = express.Router();

routes.post('/generateWatchListPdf', validate, generatePdfController)

export default routes;