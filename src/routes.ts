import { Router } from "express";
import { CheckBilletController } from "./controllers/CheckBilletController";

const routes = Router()

const checkBilletController = new CheckBilletController()

routes.get('/boleto/:value', checkBilletController.handler)

export default routes