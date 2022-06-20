import { Request, Response } from "express";
import { CheckBilletService } from "../services/CheckBilletService";

export class CheckBilletController {

    constructor() {}

    async handler (request: Request, response: Response) {
        try {
            const { value } = request.params

            if (value.length !== 47) {
                throw new Error('Invalid quantity of digits')
            } 

            const regex = /^\d+$/g

            const validate = regex.test(value)

            if (!validate) {
                throw new Error('Invalid digits')
            }
        
            const checkBilletService = new CheckBilletService()
    
            const callback = await checkBilletService.execute(value)
    
            return response.status(200).json({
                message: callback
            })
        } catch (err) {
            return response.status(400).json({
                message: err.message
            })
        }
    }
}