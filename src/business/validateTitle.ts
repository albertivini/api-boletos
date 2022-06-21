import { IFields } from "../interfaces/IFields"
import { IFieldsProperties } from "../interfaces/IFieldsProperties"
import { moduleElevenValidation, moduleTenValidation } from "../utils/modulesValidation"

export class ValidateTitleBusiness {

    field_1_check_digit: string
    field_2_check_digit: string
    field_3_check_digit: string

    async processValidation (digits: string) {        
        const scannable_lines: IFields = {
            field1: digits.substring(0, 9),
            field2: digits.substring(10, 20),
            field3: digits.substring(21, 31),
            field4: digits.substring(32, 33),
            field5: digits.substring(33, 47)
        }

        this.field_1_check_digit = digits[9]
        this.field_2_check_digit = digits[20]
        this.field_3_check_digit = digits[31]
        const check_digit_from_all_bar_code = scannable_lines.field4

        this.validateCheckDigitsFromFields(scannable_lines)

        const { bar_code_without_check_digit , fields_properties} = this.cutFieldsToBarCode(scannable_lines)

        const check_digit_bar_code = moduleElevenValidation(bar_code_without_check_digit)

        if (check_digit_bar_code.toString() !== check_digit_from_all_bar_code) throw new Error('Invalid Check Digit')

        const expiration_date = this.calculateDueDateFactor(fields_properties.due_date_factor)

        const amount = this.calculateAmount(fields_properties.billet_value)

        const bar_code = this.createBarCode(fields_properties, check_digit_from_all_bar_code)

        return { 
            bar_code,
            amount,
            expiration_date
        }
    }

    validateCheckDigitsFromFields(scannable_lines: IFields) {

        const fields_in_array = [scannable_lines.field1, scannable_lines.field2, scannable_lines.field3]

        const check_digit_in_array = [this.field_1_check_digit, this.field_2_check_digit, this.field_3_check_digit]

        for (let iterator = 0; iterator < fields_in_array.length; iterator++) {
            const check_digit = moduleTenValidation(fields_in_array[iterator])
            
            if (check_digit.toString() !== check_digit_in_array[iterator]) throw new Error('Invalid Check Digit')
        }
    }

    cutFieldsToBarCode(scannable_lines: IFields) {

        const fields_properties = {
            financial_recipient: scannable_lines.field1.substring(0, 3),
            coin: scannable_lines.field1.substring(3, 4), 
            position_20_to_24: scannable_lines.field1.substring(4, 9),
            position_25_to_34: scannable_lines.field2.substring(0,10),
            position_35_to_44: scannable_lines.field3.substring(0,10),
            due_date_factor: scannable_lines.field5.substring(0,4),
            billet_value: scannable_lines.field5.substring(4) 
        }

        const bar_code_without_check_digit = fields_properties.financial_recipient.concat(fields_properties.coin, 
            fields_properties.due_date_factor,
            fields_properties.billet_value,
            fields_properties.position_20_to_24,
            fields_properties.position_25_to_34,
            fields_properties.position_35_to_44
        )

        return { fields_properties, bar_code_without_check_digit }
    }

    barCodeCheckDigit (concatted_bar_code: string) {

        const reversed_bar_code = concatted_bar_code.split('').reverse()

        let multiplicator = 2

        let sum_result = 0

        for (const bar_code_number of reversed_bar_code) {

            if (multiplicator === 10) {
                multiplicator = 2
            } 

            const value = Number(bar_code_number) * multiplicator

            sum_result = sum_result + value

            multiplicator++
        }

        const remainder = sum_result % 11

        const subtraction = Math.abs(11 - remainder)

        if (subtraction === 0 || subtraction === 10 || subtraction === 11) {
            const check_digit = 1
            return check_digit
        }

        const check_digit = subtraction

        return check_digit
    }

    calculateDueDateFactor(due_date_factor: string) {
        let base_date = new Date('1997-10-07');

        base_date.setTime(base_date.getTime() + (Number(due_date_factor) * 24 * 60 * 60 * 1000))

        let day = base_date.getUTCDate() as string | number
        let month = base_date.getMonth() as string | number
        const year = base_date.getFullYear()

        if (month < 10) {
            month = `0${month}`
        }

        if (day < 10) {
            day = `0${day}`
        }

        const expiration_date = `${year}/${month}/${day}`

        return expiration_date
    }

    calculateAmount(billet_value: string) {

        const integers = billet_value.substring(0,8)
        const decimals = billet_value.substring(8,10)

        const amount_string = `${integers}.${decimals}`

        const amount = Number(amount_string).toFixed(2)

        return amount
    }

    createBarCode(fields_properties: IFieldsProperties, check_digit_bar_code: string) {

        const bar_code = fields_properties.financial_recipient.concat(fields_properties.coin, 
            check_digit_bar_code,
            fields_properties.due_date_factor,
            fields_properties.billet_value,
            fields_properties.position_20_to_24,
            fields_properties.position_25_to_34,
            fields_properties.position_35_to_44)

        return bar_code
    }
}