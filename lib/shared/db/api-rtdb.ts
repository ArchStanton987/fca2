export type AdditionalCategory = "clothings" | "consumables" | "effects" | "miscObjects"

export type AdditionalParams = { category?: AdditionalCategory }

const rtdb = {
  getAdditionalData: ({ category }: AdditionalParams) => `v2/additional/${category}`,
  getAdditionalClothings: ({ category }: { category: string }) =>
    `v2/additional/clothings/${category}`,
  getAdditionalConsumables: ({ category }: { category: string }) =>
    `v2/additional/consumables/${category}`,
  getAdditionalEffects: ({ category }: { category: string }) => `v2/additional/effects/${category}`,
  getAdditionalMiscObjects: ({ category }: { category: string }) =>
    `v2/additional/miscObjects/${category}`
}

export default rtdb
