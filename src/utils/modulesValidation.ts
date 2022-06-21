export function moduleTenValidation(field: string) {
    const reversed_field_array = field.split('').reverse()

    let result = 0

    for (let iterator = 0; iterator < reversed_field_array.length; iterator = iterator + 2) {
        const value = Number(reversed_field_array[iterator]) * 2 

        if (value > 9) {
            const value_array = value.toString().split('')
            const new_value = Number(value_array[0]) + Number(value_array[1])

            result = result + new_value
        } else {
            result = result + value
        }
    }

    for (let iterator = 1; iterator < reversed_field_array.length; iterator = iterator + 2) {
        const value = Number(reversed_field_array[iterator]) * 1 
        result = result + value
    }

    const next_ten = Math.ceil(result / 10) * 10

    const check_digit = next_ten - result

    if (check_digit === 10) {
        const new_check_digit = 0
        return new_check_digit
    }

    return check_digit

}

export function moduleElevenValidation(field: string) {

    const reversed_field_code = field.split('').reverse()

    let multiplicator = 2

    let sum_result = 0

    for (const bar_code_number of reversed_field_code) {

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