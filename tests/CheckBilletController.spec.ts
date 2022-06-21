import supertest from "supertest"
import { app } from "../src/infra/app"
import { expect } from "chai"

describe('Test Suit - Check Billet Controller', async () => {

    it('SUCCESS: Send Valid Digits To Title', async () => {
        const response = await supertest(app).get('/boleto/21290001192110001210904475617405975870000002000')

        expect(response.statusCode).to.be.equal(200)
    })

    it.only('SUCCESS: Send Valid Digits To Covenant', async () => {
        const response = await supertest(app).get('/boleto/836800000033453700513006044547803310401214785198')

        console.log(response.body)

        expect(response.statusCode).to.be.equal(200)
    })
})