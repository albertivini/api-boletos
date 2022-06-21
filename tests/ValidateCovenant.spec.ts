import { expect } from "chai"
import { ValidateCovenantBusiness } from "../src/business/validateCovenant"
import sinon from "sinon"
import { IResponse } from "../src/interfaces/IResponse"
import { moduleTenValidation } from "../src/utils/modulesValidation"

const right_digits = '836800000033453700513006044547803310401214785198'
const digits_with_wrong_first_check_digit = '836800000034453700513006044547803310401214785198'
const digits_with_wrong_second_check_digit = '836800000033453700513007044547803310401214785198'
const digits_with_wrong_third_check_digit = '836800000033453700513006044547803311401214785198'
const digits_with_wrong_fourth_check_digit = '836800000033453700513006044547803310401214785195'
const digits_with_wrong_check_digit = '836600000033453700513006044547803310401214785198'

const validateCovenantBusiness = new ValidateCovenantBusiness()

const return_body = {
    bar_code: '83680000003453700513000445478033140121478519',
    amount: '345.37',
    expiration_date: undefined
} as IResponse

describe('Test Suit - Validate Covenant', async () => {

    beforeEach('Before Each', async () => {
        sinon.restore()
    })

    it('SUCCESS: Validate Right Covenant', async () => {

        const response = validateCovenantBusiness.processValidation(right_digits)

        expect(response).to.be.deep.equal(return_body)
    })

    it('ERROR: Error in Check Digit from First Field', async () => { 

        let response

        try {
            response = validateCovenantBusiness.processValidation(digits_with_wrong_first_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('ERROR: Error in Check Digit from Second Field', async () => { 

        let response

        try {
            response = validateCovenantBusiness.processValidation(digits_with_wrong_second_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('ERROR: Error in Check Digit from Third Field', async () => { 

        let response

        try {
            response = validateCovenantBusiness.processValidation(digits_with_wrong_third_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('ERROR: Error in Check Digit from Fourth Field', async () => { 

        let response

        try {
            response = validateCovenantBusiness.processValidation(digits_with_wrong_fourth_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('ERROR: Error in Check Digit from All Bar Code', async () => { 

        let response

        try {
            response = validateCovenantBusiness.processValidation(digits_with_wrong_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('SUCCESS: Verify Field Check Digit Module 11', async () => {

        const field = '2234565991'

        const response = validateCovenantBusiness.verifyDigitByModule(11, field)

        expect(response).to.be.equal(1)

    })

    it('SUCCESS: Verify Field Check Digit Incorrect Module', async () => {
        const field = '2234565991'

        const response = validateCovenantBusiness.verifyDigitByModule(12, field)

        expect(response).to.be.equal(undefined)
    })

    it('SUCCESS: Verify Bar Code Check Digit', async () => {
        const coin_code = '8'

        const bar_code = '1234567891234567891234567891234567891234567'

        const response = validateCovenantBusiness.verifyBarCodeCheckDigit(coin_code, bar_code)

        expect(response).to.be.equal(1)
    })

    it('SUCCESS: Get Due Date With Right Date', async () => {

        const barcode = '83680000003453700520220415478033140121478519'

        const response = validateCovenantBusiness.getDueDate(barcode)

        expect(response).to.be.equal('2022/04/15')
    })

    it('SUCCESS: Verify Bar Code Check Digit Incorrect Coin Code', async () => {
        const coin_code = '3'

        const bar_code = '1234567891234567891234567891234567891234567'

        const response = validateCovenantBusiness.verifyBarCodeCheckDigit(coin_code, bar_code)

        expect(response).to.be.equal(undefined)
    })

    it('SUCCESS: Verify Fields Check Digits Incorrect Coin Code', async () => {
        const coin_code = '3'

        const scannable_lines = {
            field1: 'string',
            field2: 'string',
            field3: 'string',
            field4: 'string'
        }

        const response = validateCovenantBusiness.verifyFieldsCheckDigits(coin_code, scannable_lines)

        expect(response).to.be.equal(undefined)
    })

    it('SUCCESS: Verify Fields Check Digits Incorrect Coin Code', async () => {

        sinon.stub(ValidateCovenantBusiness.prototype, 'sendToVerification').resolves()
        const coin_code = '8'

        const scannable_lines = {
            field1: '123',
            field2: '123',
            field3: '123',
            field4: '123'
        }

        const response = validateCovenantBusiness.verifyFieldsCheckDigits(coin_code, scannable_lines)

        expect(response).to.be.equal(undefined)
    })
})