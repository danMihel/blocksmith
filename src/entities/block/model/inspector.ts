import type { BlockLink } from './fields'

/*
 * Declarative description of the inspector form of a block.
 *
 * `FieldDef<P>` is derived from the block props type: the key must exist in P and the
 * control must suit the value type — a `list` only for arrays, a `link` only for links,
 * a `toggle` only for booleans. Typos and mismatches fail at compile time.
 */

type StringKey<T> = Extract<keyof T, string>

type FieldBase<K extends string> = {
  key: K
  label: string
  hint?: string
}

export type TextField<K extends string = string> = FieldBase<K> & {
  control: 'text'
  placeholder?: string
}

export type TextareaField<K extends string = string> = FieldBase<K> & {
  control: 'textarea'
  rows?: number
  placeholder?: string
}

export type ChoiceField<K extends string = string, V = string | number> = FieldBase<K> & {
  control: 'choice'
  options: readonly { value: V; label: string }[]
}

export type IconField<K extends string = string> = FieldBase<K> & { control: 'icon' }

export type LinkField<K extends string = string> = FieldBase<K> & { control: 'link' }

export type ToggleField<K extends string = string> = FieldBase<K> & { control: 'toggle' }

export type ListField<K extends string = string, I = unknown> = FieldBase<K> & {
  control: 'list'
  /** Singular noun for buttons: "Add feature". */
  itemLabel: string
  fields: FieldDef<I>[]
  createItem: () => I
  /** Item field shown as the collapsed item title. */
  titleKey?: StringKey<I>
  min?: number
  max?: number
}

type FieldFor<P, K extends StringKey<P>> = P[K] extends readonly (infer I)[]
  ? ListField<K, I>
  : P[K] extends BlockLink
    ? LinkField<K>
    : P[K] extends string
      ? TextField<K> | TextareaField<K> | ChoiceField<K, P[K]> | IconField<K>
      : P[K] extends number
        ? ChoiceField<K, P[K]>
        : P[K] extends boolean
          ? ToggleField<K>
          : never

type IsAny<T> = 0 extends 1 & T ? true : false

/** `FieldDef<any>` (a type-erased definition) is the erased `AnyField`, not a mapped `any`. */
export type FieldDef<P> =
  IsAny<P> extends true ? AnyField : { [K in StringKey<P>]: FieldFor<P, K> }[StringKey<P>]

/** Type-erased field, as the generic inspector sees it. */
export type AnyField =
  | TextField
  | TextareaField
  | ChoiceField
  | IconField
  | LinkField
  | ToggleField
  | (FieldBase<string> & {
      control: 'list'
      itemLabel: string
      fields: AnyField[]
      createItem: () => unknown
      titleKey?: string
      min?: number
      max?: number
    })

export type AnyListField = Extract<AnyField, { control: 'list' }>
