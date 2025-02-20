export type AdditionalCategory = "clothings" | "consumables" | "effects" | "miscObjects"

export type AdditionalParams = { childKey?: AdditionalCategory }
export type AdditionalClothingsParams = { childKey?: string }
export type AdditionalConsumablesParams = { childKey?: string }
export type AdditionalEffectsParams = { childKey?: string }
export type AdditionalMiscParams = { childKey?: string }

const rtdb = {
  getAdditionalData: ({ childKey }: AdditionalParams) => `v2/additional/${childKey ?? ""}`,
  getAdditionalClothings: ({ childKey }: AdditionalClothingsParams) =>
    `v2/additional/clothings/${childKey ?? ""}`,
  getAdditionalConsumables: ({ childKey }: AdditionalConsumablesParams) =>
    `v2/additional/consumables/${childKey ?? ""}`,
  getAdditionalEffects: ({ childKey }: AdditionalEffectsParams) =>
    `v2/additional/effects/${childKey ?? ""}`,
  getAdditionalMiscObjects: ({ childKey }: AdditionalMiscParams) =>
    `v2/additional/miscObjects/${childKey ?? ""}`
}

export default rtdb
