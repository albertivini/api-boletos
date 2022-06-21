export interface IFieldsProperties {
    financial_recipient: string
    coin: string
    position_20_to_24: string
    position_25_to_34: string
    position_35_to_44: string
    due_date_factor: string
    billet_value: string
}

export interface IBarCodeFieldsProperties {
    fields_properties: IFieldsProperties,
    bar_code_without_check_digit: string
}