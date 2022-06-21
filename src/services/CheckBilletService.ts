import { ValidateCovenantBusiness } from "../business/validateCovenant"
import { ValidateTitleBusiness } from "../business/validateTitle"
import { IFields } from "../interfaces/IFields"


export class CheckBilletService {

    bar_code: string

    validateTitle: ValidateTitleBusiness

    validateCovenant: ValidateCovenantBusiness

    constructor() {
        this.validateTitle = new ValidateTitleBusiness()
        this.validateCovenant = new ValidateCovenantBusiness()
    }

    async execute(digits: string) {

        if (digits.length === 47) return this.validateTitle.processValidation(digits)

        if (digits.length === 48) return this.validateCovenant.processValidation(digits)

    }
} 