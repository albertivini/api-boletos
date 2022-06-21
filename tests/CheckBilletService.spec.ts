import { expect } from "chai"
import sinon from "sinon"
import { ValidateCovenantBusiness } from "../src/business/validateCovenant"
import { ValidateTitleBusiness } from "../src/business/validateTitle"
import { IResponse } from "../src/interfaces/IResponse"
import { CheckBilletService } from "../src/services/CheckBilletService"

const checkBilletService = new CheckBilletService()

const return_body = {
    bar_code: 'bar_code',
    amount: 'value',
    expiration_date: 'date'
} as IResponse

describe('Test Suit - Check Billet Service', async () => {

    beforeEach('Before Each', async () => {
        sinon.restore()
    })

    it('SUCCESS: Validate Title Digits', async () => {
        sinon.stub(ValidateTitleBusiness.prototype, 'processValidation').resolves(return_body)

        const digits = '21290001192110001210904475617405975870000002000'

        const response = await checkBilletService.execute(digits)

        expect(response).to.be.deep.equal(return_body)
    })

    it('SUCCESS: Validate Covenant Digits', async () => {
        delete return_body.expiration_date

        sinon.stub(ValidateCovenantBusiness.prototype, 'processValidation').resolves(return_body)

        const digits = '836800000033453700513006044547803310401214785198'

        const response = await checkBilletService.execute(digits)

        expect(response).to.be.deep.equal(return_body)
    })

    it('SUCCESS: Less than 47 and 48 Digits', async () => {
        delete return_body.expiration_date

        sinon.stub(ValidateCovenantBusiness.prototype, 'processValidation').resolves(return_body)

        const digits = '123'

        const response = await checkBilletService.execute(digits)

        expect(response).to.be.equal(undefined)
    })
})