
// BRANDED TYPES
export type Email = string & { readonly Email: unique symbol }
export const Email = {
  ofString: (value: string) => {
    if (!value.includes("@")) {
      throw new Error(`Not valid email`)
    }

    return value as Email
  }
}
