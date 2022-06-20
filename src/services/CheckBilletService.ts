import { ICuttedFields } from "../interfaces/ICuttedFields"
import { IFields } from "../interfaces/IFields"


export class CheckBilletService {

    bar_code: string

    constructor() {}

    async execute(digits: string) {
        const scannable_lines: IFields = {
            field1: digits.substring(0, 10),
            field2: digits.substring(10, 21),
            field3: digits.substring(21, 32),
            field4: digits.substring(32, 33),
            field5: digits.substring(33, 47)
        }

        const check_digit_field_1 = this.calculataDVField1(scannable_lines)

        // if (check_digit_field_1.toString() !== scannable_lines.field1.substring(9,10)) {
        //     throw new Error('Invalid Scannable Lines')
        // }

        const check_digit_field_2 = this.calculateCheckDigit(scannable_lines.field2)

        // if (check_digit_field_2.toString() !== scannable_lines.field2.substring(10, 11)) {
        //     throw new Error('Invalid Scannable Lines')
        // }

        const check_digit_field_3 = this.calculateCheckDigit(scannable_lines.field3)

        // if (check_digit_field_3.toString() !== scannable_lines.field3.substring(10, 11)) {
        //     throw new Error('Invalid Scannable Lines')
        // }

        const { change_cutted_fields_to_array,concatted_bar_code,cutted_fields} = this.cutFieldsToBarCode(scannable_lines)

        const check_digit_bar_code = this.barCodeCheckDigit(concatted_bar_code)

        // if (check_digit_bar_code !== scannable_lines.field4) {
        //     throw new Error('Invalid Check Digit')
        // }

        const expiration_date = this.calculateDueDateFactor(cutted_fields.due_date_factor)

        const amount = this.calculateAmount(cutted_fields.billet_value)

        const bar_code = this.createBarCode(change_cutted_fields_to_array, check_digit_bar_code.toString())

        return { 
            bar_code,
            amount,
            expiration_date
        }
    }

    calculataDVField1 (scannable_lines: IFields) {
        const field_1_without_dv = scannable_lines.field1.substring(0,9)

        const reversed_field_1 = field_1_without_dv.split('').reverse().join('')

        let resultado = 0

        // soma ao resultado os digitos q multiplica por 2
        for (let iterator = 0; iterator < reversed_field_1.length; iterator = iterator + 2) {
            const value = Number(reversed_field_1.substring(iterator, iterator + 1)) * 2 

            if (value > 9) {
                const value_array = value.toString().split('')
                const new_value = Number(value_array[0]) + Number(value_array[1])

                resultado = resultado + new_value
            } else {
                resultado = resultado + value
            }
        }

        // soma ao resultado os digitos q multiplicam por 1
        for (let iterator = 1; iterator < reversed_field_1.length; iterator = iterator + 2) {
            const value = Number(reversed_field_1.substring(iterator, iterator + 1)) * 1 
            resultado = resultado + value
        }

        // arredonda o resultado para o maior mais proximo
        function arredonda(resultado: number) {
            return Math.ceil(resultado / 10) * 10;
        }

        const next_ten = arredonda(resultado)

        const check_digit = next_ten - resultado

        if (check_digit === 10) {
            const new_check_digit = 0
            return new_check_digit
        }

        return check_digit
    }

    calculateCheckDigit(field: string) {
        const field_without_cd = field.substring(0,10)

        const reverse_field = field_without_cd.split('').reverse().join('')

        let resultado = 0

        for (let iterator = 0; iterator < reverse_field.length; iterator = iterator + 2) {
            const value = Number(reverse_field.substring(iterator, iterator + 1)) * 2 

            if (value > 9) {
                const value_array = value.toString().split('')
                const new_value = Number(value_array[0]) + Number(value_array[1])

                resultado = resultado + new_value
            } else {
                resultado = resultado + value
            }
        }

        // soma ao resultado os digitos q multiplicam por 1
        for (let iterator = 1; iterator < reverse_field.length; iterator = iterator + 2) {
            const value = Number(reverse_field.substring(iterator, iterator + 1)) * 1 
            resultado = resultado + value
        }

        function arredonda(resultado: number) {
            return Math.ceil(resultado / 10) * 10;
        }

        console.log(resultado)

        const next_ten = arredonda(resultado)

        const check_digit = next_ten - resultado

        if (check_digit === 10) {
            const new_check_digit = 0
            return new_check_digit
        }

        return check_digit
    }

    cutFieldsToBarCode(scannable_lines: IFields) {

        const cutted_fields = {
            financial_recipient: scannable_lines.field1.substring(0, 3),
            coin: scannable_lines.field1.substring(4,5), 
            position_20_to_24: scannable_lines.field1.substring(5, 9),
            position_25_to_34: scannable_lines.field2.substring(0,10),
            position_35_to_44: scannable_lines.field3.substring(0,10),
            due_date_factor: scannable_lines.field5.substring(0,4),
            billet_value: scannable_lines.field5.substring(5) 
        }

        const change_cutted_fields_to_array = {
            financial_recipient: cutted_fields.financial_recipient.split(''),
            coin: cutted_fields.coin.split(''),
            billet_value: cutted_fields.billet_value.split(''),
            due_date_factor: cutted_fields.due_date_factor.split(''),
            position_20_to_24: cutted_fields.position_20_to_24.split(''),
            position_25_to_34: cutted_fields.position_25_to_34.split(''),
            position_35_to_44: cutted_fields.position_35_to_44.split('')
        }

        const concatted_bar_code = change_cutted_fields_to_array.financial_recipient.concat(change_cutted_fields_to_array.coin, 
            change_cutted_fields_to_array.due_date_factor,
            change_cutted_fields_to_array.billet_value,
            change_cutted_fields_to_array.position_20_to_24,
            change_cutted_fields_to_array.position_25_to_34,
            change_cutted_fields_to_array.position_35_to_44
            )

        return { cutted_fields, change_cutted_fields_to_array, concatted_bar_code }
    }

    barCodeCheckDigit (concatted_bar_code: string[]) {
        const reversed_bar_code = concatted_bar_code.reverse()

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

        if (remainder === 0 || remainder === 10 || remainder === 11) {
            const check_digit = 1
            return check_digit
        }

        const check_digit = remainder

        return check_digit
    }

    calculateDueDateFactor(due_date_factor: string) {
        let base_date = new Date('10/07/1997');

        base_date.setTime(base_date.getTime() + (Number(due_date_factor) * 24 * 60 * 60 * 1000))

        let day = base_date.getDay() as string | number
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

        const decimals = billet_value.substring(8,10)
        const integers = billet_value.substring(0,7)

        const amount_string = `${integers}.${decimals}`

        const amount = Number(amount_string).toFixed(2)
        
        return amount
    }

    createBarCode(change_cutted_fields_to_array: any, check_digit_bar_code: string) {

        const check_digit = [check_digit_bar_code]

        const bar_code_array = change_cutted_fields_to_array.financial_recipient.concat(change_cutted_fields_to_array.coin, 
            check_digit,
            change_cutted_fields_to_array.due_date_factor,
            change_cutted_fields_to_array.billet_value,
            change_cutted_fields_to_array.position_20_to_24,
            change_cutted_fields_to_array.position_25_to_34,
            change_cutted_fields_to_array.position_35_to_44
            )
            
        const bar_code = bar_code_array.join('')

        return bar_code
    }
} 