import express from "express";

import { generatePdfController } from "../controller/pdfController.mjs";
import { validate } from "../middleware/validator.mjs";

let routes = express.Router();

routes.post('/generateWatchListPdf', validate, generatePdfController)

export default routes;