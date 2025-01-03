import { generatePdfService } from "../service/pdfService.mjs";

export const generatePdfController = (req, res, next)=>{
    try{
        const {email} = req.body;
        generatePdfService(req,res)
    }catch(error){
        next(error)
    }
}