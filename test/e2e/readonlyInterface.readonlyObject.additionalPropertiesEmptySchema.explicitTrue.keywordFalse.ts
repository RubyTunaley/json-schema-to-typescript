export const input = {
  type: 'object',
  required: ['a', 'b'],
  properties: {
    a: {
      type: 'string',
      tsReadonlyProperty: true
    },
    b: {
      type: 'string',
      tsReadonlyProperty: false
    },
    c: {
      type: 'string',
      tsReadonlyProperty: true
    },
    d: {
      type: 'string',
      tsReadonlyProperty: false
    }
  },
  additionalProperties: {},
  tsReadonlyPropertyDefaultValue: true
}

export const options = {
  readonlyKeyword: false
}