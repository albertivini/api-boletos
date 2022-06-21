import supertest from "supertest"
import { app } from "../src/infra/app"
import { expect } from "chai"
import sinon from "sinon"
import { CheckBilletService } from "../src/services/CheckBilletService"
import { IResponse } from "../src/interfaces/IResponse"

const return_body = {
    bar_code: 'bar_code',
    amount: 'value',
    expiration_date: 'date'
} as IResponse

describe('Test Suit - Check Billet Controller', async () => {

    beforeEach('Before Each', async () => {
        sinon.restore()
    })

    it('SUCCESS: Send Valid Digits To Title', async () => {
        sinon.stub(CheckBilletService.prototype, 'execute').resolves(return_body)

        const response = await supertest(app).get('/boleto/21290001192110001210904475617405975870000002000')

        expect(response.statusCode).to.be.equal(200)
    })

    it('SUCCESS: Send Valid Digits To Covenant', async () => {
        sinon.stub(CheckBilletService.prototype, 'execute').resolves(return_body)

        const response = await supertest(app).get('/boleto/836800000033453700513006044547803310401214785198')

        expect(response.statusCode).to.be.equal(200)
    })

    it('ERROR: Send Invalid Qauntity of Digits', async () => {
        const response = await supertest(app).get('/boleto/836800000033453700513006044547803310401214785')

        expect(response.statusCode).to.be.equal(400)
    })

    it('ERROR: Send Invalid Digits', async () => {
        const response = await supertest(app).get('/boleto/83680000003345370051300604454780aad310401214785')

        expect(response.statusCode).to.be.equal(400)
    })
})