import { IFields } from "../interfaces/IFields"
import { moduleElevenValidation, moduleTenValidation } from "../utils/modulesValidation"


export class ValidateCovenantBusiness {

    field_1_check_digit: string
    field_2_check_digit: string
    field_3_check_digit: string
    field_4_check_digit: string

    processValidation(digits: string) {

        const scannable_lines: IFields = {
            field1: digits.substring(0, 11),
            field2: digits.substring(12, 23),
            field3: digits.substring(24, 35),
            field4: digits.substring(36, 47),
        }

        this.field_1_check_digit = digits[11]
        this.field_2_check_digit = digits[23]
        this.field_3_check_digit = digits[35]
        this.field_4_check_digit = digits[47]

        const coin_code = scannable_lines.field1[2]
        const check_digit_bar_code = scannable_lines.field1[3]

        this.verifyFieldsCheckDigits(coin_code, scannable_lines)

        const bar_code_without_check_code = this.createBarCodeWithoutCheckCode(scannable_lines)

        const check_digit = this.verifyBarCodeCheckDigit(coin_code, bar_code_without_check_code)

        if (check_digit.toString() !== check_digit_bar_code) throw new Error('Invalid Check Digit')

        const bar_code = scannable_lines.field1.concat(scannable_lines.field2, scannable_lines.field3, scannable_lines.field4)

        const amount = this.getAmount(bar_code)

        const expiration_date = this.getDueDate(bar_code)
        
        return {
            bar_code,
            amount,
            expiration_date
        }
        
    }

    verifyFieldsCheckDigits(coin_code: string, scannable_lines: IFields) {

        const fields_in_array = [scannable_lines.field1, scannable_lines.field2, scannable_lines.field3, scannable_lines.field4]

        const check_digit_in_array = [this.field_1_check_digit, this.field_2_check_digit, this.field_3_check_digit, this.field_4_check_digit]

        if (coin_code === '6' || coin_code === '7') this.sendToVerification(10, fields_in_array, check_digit_in_array)

        if (coin_code === '8' || coin_code === '9') this.sendToVerification(11, fields_in_array, check_digit_in_array)
    }

    sendToVerification(module: number, fields_in_array: string[], check_digit_in_array: string[]) {
        for (let iterator = 0; iterator < fields_in_array.length; iterator++) {
            const check_digit = this.verifyDigitByModule(module, fields_in_array[iterator])
            
            if (check_digit.toString() !== check_digit_in_array[iterator]) throw new Error('Invalid Check Digit')
        }
    }

    verifyDigitByModule(module: number, field: string) {
        
        if (module === 10) return moduleTenValidation(field)

        if (module === 11) return moduleElevenValidation(field)

    }

    createBarCodeWithoutCheckCode(scannable_lines: IFields) {
        const first_part_from_field1 = scannable_lines.field1.substring(0,3)
        const last_part_from_field1 = scannable_lines.field1.substring(4)

        const bar_code_without_check_code = first_part_from_field1.concat(last_part_from_field1, 
            scannable_lines.field2, 
            scannable_lines.field3, 
            scannable_lines.field4)

        return bar_code_without_check_code
    }

    verifyBarCodeCheckDigit(coin_code: string, bar_code_without_check_code: string) {
        if (coin_code === '6' || coin_code === '7') return this.verifyDigitByModule(10, bar_code_without_check_code)
        if (coin_code === '8' || coin_code === '9') return this.verifyDigitByModule(11, bar_code_without_check_code)
    }

    getAmount (bar_code: string) {
        const billet_value = bar_code.substring(5, 15)

        const integers = billet_value.substring(0, 8)
        const decimals = billet_value.substring(8, 11)

        const amount_string = `${integers}.${decimals}`

        const amount = Number(amount_string).toFixed(2)

        return amount
    }

    getDueDate(bar_code: string) {
        const date_string = bar_code.substring(18,26)

        const year = date_string.substring(0, 4)
        const month = date_string.substring(4, 6)
        const day = date_string.substring(6, 8)

        const bar_code_date = new Date(`${year}-${month}-${day}`)

        const reference_day_get_time = new Date('1997-10-07').getTime()

        if (bar_code_date.toString() === 'Invalid Date' || bar_code_date.getTime() < reference_day_get_time) {
            return undefined
        }

        const expiration_date = `${year}/${month}/${day}`

        return expiration_date
    }
}