import supertest from "supertest"
import { app } from "../src/infra/app"

describe('Test Suit - Check Billet Controller', async () => {

    it.only('SUCCESS: Send Valid Digits', async () => {
        const response = await supertest(app).get('/boleto/11021324354657687981091110121113121413151416514')

        console.log(response)
    })
})