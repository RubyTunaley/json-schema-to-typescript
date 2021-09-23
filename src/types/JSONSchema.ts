import {JSONSchema4, JSONSchema4Type, JSONSchema4TypeName} from 'json-schema'
import {isPlainObject, memoize} from 'lodash'

export type SchemaType =
  | 'ALL_OF'
  | 'UNNAMED_SCHEMA'
  | 'ANY'
  | 'ANY_OF'
  | 'BOOLEAN'
  | 'NAMED_ENUM'
  | 'NAMED_SCHEMA'
  | 'NULL'
  | 'NUMBER'
  | 'STRING'
  | 'OBJECT'
  | 'ONE_OF'
  | 'TYPED_ARRAY'
  | 'REFERENCE'
  | 'UNION'
  | 'UNNAMED_ENUM'
  | 'UNTYPED_ARRAY'
  | 'CUSTOM_TYPE'

export type JSONSchemaTypeName = JSONSchema4TypeName
export type JSONSchemaType = JSONSchema4Type

export interface JSONSchema extends JSONSchema4 {
  /**
   * schema extension to support numeric enums
   */
  tsEnumNames?: string[]
  /**
   * schema extension to support custom types
   */
  tsType?: string
  /**
   * schema extension to support readonly types
   */
  tsReadonly?: boolean
  /**
   * schema extension to support readonly properties
   */
  tsReadonlyProperty?: boolean
  /**
   * schema extension to support changing the default value of tsReadonlyProperty on this schema's properties
   */
  tsReadonlyPropertyDefaultValue?: boolean

  // NOTE: When adding a new custom property, you MUST ALSO add that custom property as an exclusion in the
  // nonCustomKeys function in src/typesOfSchema.ts
  // If you do not do this weird things happen with otherwise empty schemas:
  // {"title": "X", "additionalProperties": {"myCustomProperty": null}}
  // Outputs: interface X {[k: string]: {[k: string]: unknown}}
  // Instead of the expected: interface X {[k: string]: unknown}
  // (or [k: string]: any depending on options)
}

export const Parent = Symbol('Parent')

export interface LinkedJSONSchema extends JSONSchema {
  /**
   * A reference to this schema's parent node, for convenience.
   * `null` when this is the root schema.
   */
  [Parent]: LinkedJSONSchema | null

  additionalItems?: boolean | LinkedJSONSchema
  additionalProperties: boolean | LinkedJSONSchema
  items?: LinkedJSONSchema | LinkedJSONSchema[]
  definitions?: {
    [k: string]: LinkedJSONSchema
  }
  properties?: {
    [k: string]: LinkedJSONSchema
  }
  patternProperties?: {
    [k: string]: LinkedJSONSchema
  }
  dependencies?: {
    [k: string]: LinkedJSONSchema | string[]
  }
  allOf?: LinkedJSONSchema[]
  anyOf?: LinkedJSONSchema[]
  oneOf?: LinkedJSONSchema[]
  not?: LinkedJSONSchema
}

export interface NormalizedJSONSchema extends LinkedJSONSchema {
  additionalItems?: boolean | NormalizedJSONSchema
  additionalProperties: boolean | NormalizedJSONSchema
  extends?: string[]
  items?: NormalizedJSONSchema | NormalizedJSONSchema[]
  definitions?: {
    [k: string]: NormalizedJSONSchema
  }
  properties?: {
    [k: string]: NormalizedJSONSchema
  }
  patternProperties?: {
    [k: string]: NormalizedJSONSchema
  }
  dependencies?: {
    [k: string]: NormalizedJSONSchema | string[]
  }
  allOf?: NormalizedJSONSchema[]
  anyOf?: NormalizedJSONSchema[]
  oneOf?: NormalizedJSONSchema[]
  not?: NormalizedJSONSchema
  required: string[]
}

export interface EnumJSONSchema extends NormalizedJSONSchema {
  enum: any[]
}

export interface NamedEnumJSONSchema extends NormalizedJSONSchema {
  tsEnumNames: string[]
}

export interface SchemaSchema extends NormalizedJSONSchema {
  properties: {
    [k: string]: NormalizedJSONSchema
  }
  required: string[]
}

export interface JSONSchemaWithDefinitions extends NormalizedJSONSchema {
  definitions: {
    [k: string]: NormalizedJSONSchema
  }
}

export interface CustomTypeJSONSchema extends NormalizedJSONSchema {
  tsType: string
}

export const getRootSchema = memoize(
  (schema: LinkedJSONSchema): LinkedJSONSchema => {
    const parent = schema[Parent]
    if (!parent) {
      return schema
    }
    return getRootSchema(parent)
  }
)

export function isPrimitive(schema: LinkedJSONSchema | JSONSchemaType): schema is JSONSchemaType {
  return !isPlainObject(schema)
}

export function isCompound(schema: JSONSchema): boolean {
  return Array.isArray(schema.type) || 'anyOf' in schema || 'oneOf' in schema
}
