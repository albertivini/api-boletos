import { expect } from "chai"
import { moduleTenValidation } from "../src/utils/modulesValidation"


describe('Test Suit - Modules Validation', async () => {

    it('SUCCESS: Validation when Check Digit is 10', async () => {
        const field = '00'

        const response = moduleTenValidation(field)

        expect(response).to.be.equal(0)
    })
})