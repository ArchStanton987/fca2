import { HealthStatusId } from "lib/character/health/health-types"

export type UpdateHealthModalParams = {
  charId: string
  squadId: string
  initElement: HealthStatusId
}
