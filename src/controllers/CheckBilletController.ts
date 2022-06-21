import { Request, Response } from "express";
import { CheckBilletService } from "../services/CheckBilletService";

export class CheckBilletController {

    constructor() {}

    async handler (request: Request, response: Response) {
        try {
            const { value } = request.params

            if (value.length !== 47 && value.length !== 48) {
                throw new Error('Invalid quantity of digits')
            } 

            const regex = /^\d+$/g

            const validate = regex.test(value)

            if (!validate) {
                throw new Error('Invalid digits')
            }
        
            const checkBilletService = new CheckBilletService()
    
            const returned_body = await checkBilletService.execute(value)
    
            return response.status(200).json(returned_body)
        } catch (err) {
            return response.status(400).json({
                message: err.message
            })
        }
    }
}