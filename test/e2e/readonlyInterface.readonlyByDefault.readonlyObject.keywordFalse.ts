export const input = {
  type: 'object',
  required: ['a', 'b'],
  properties: {
    a: {
      type: 'string'
    },
    b: {
      type: 'string',
      tsReadonlyProperty: false
    },
    c: {
      type: 'string'
    },
    d: {
      type: 'string',
      tsReadonlyProperty: false
    }
  },
  additionalProperties: false
}

export const options = {
  readonlyByDefault: true,
  readonlyKeyword: false
}
