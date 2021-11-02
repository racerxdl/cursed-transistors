interface TransistorAttribute {
  trait_type: string
  value: number | string
  max_value?: number
  min_value?: number
  unit?: string
  display_type?: string
}

interface TransistorCursedAttribute {
  Name: string
  Unit: string
  Value: number
  Range: Array<number>
  Decimals: number
}

interface TransistorData {
  name: string
  description: string
  image: string
  attributes: Array<TransistorAttribute>
  ct_attributes: Array<TransistorCursedAttribute>
}
