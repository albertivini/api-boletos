import { expect } from "chai"
import sinon from "sinon"
import { ValidateTitleBusiness } from "../src/business/validateTitle"
import { IResponse } from "../src/interfaces/IResponse"

const right_digits = '21290001192110001210904475617405975870000002000'
const digits_with_wrong_first_check_digit = '21290001182110001210904475617405975870000002000'
const digits_with_wrong_second_check_digit = '21290001192110001210804475617405975870000002000'
const digits_with_wrong_third_check_digit = '21290001192110001210904475617404975870000002000'
const digits_with_wrong_check_digit = '21290001192110001210904475617405575870000002000'

const validateTitleBusiness = new ValidateTitleBusiness()

const return_body = {
    bar_code: '21299758700000020000001121100012100447561740',
    amount: '20.00',
    expiration_date: '2018/06/16'
} as IResponse

describe('Test Suit - Validate Title', async () => {
    
    beforeEach('Before Each', async () => {
        sinon.restore()
    })

    it('SUCCESS: Validate Right Title', async () => {

        const response = validateTitleBusiness.processValidation(right_digits)

        expect(response).to.be.deep.equal(return_body)
    })

    it('ERROR: Error in Check Digit from First Field', async () => { 

        let response

        try {
            response = validateTitleBusiness.processValidation(digits_with_wrong_first_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('ERROR: Error in Check Digit from Second Field', async () => { 

        let response

        try {
            response = validateTitleBusiness.processValidation(digits_with_wrong_second_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('ERROR: Error in Check Digit from Third Field', async () => { 

        let response

        try {
            response = validateTitleBusiness.processValidation(digits_with_wrong_third_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('ERROR: Error in Check Digit from All Bar Code', async () => { 

        let response

        try {
            response = validateTitleBusiness.processValidation(digits_with_wrong_check_digit)
        } catch (err) {
            response = err
        }

        expect(response.message).to.be.equal('Invalid Check Digit')
    })

    it('SUCCESS: Calculate Due Date with day less than 10', async () => {

        const factor = '7580'

        const response = validateTitleBusiness.calculateDueDateFactor(factor)

        expect(response).to.be.equal('2018/06/09')
    })

    it('SUCCESS: Calculate Due Date with month more than 10', async () => {

        const factor = '7750'

        const response = validateTitleBusiness.calculateDueDateFactor(factor)

        expect(response).to.be.equal('2018/11/26')
    })
})