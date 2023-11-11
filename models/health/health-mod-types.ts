export type HealthModId = "addictChance" | "withdrawLength"

export type HealthMod = {
  id: HealthModId
  calc: (obj: unknown) => number
}
