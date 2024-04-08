import healthMap from "lib/character/health/health"

type ItemUpdate = { count: number; label: string; initValue: number }
export const defaultHealthUpdate = {
  groinHp: {} as ItemUpdate,
  headHp: {} as ItemUpdate,
  leftArmHp: {} as ItemUpdate,
  leftLegHp: {} as ItemUpdate,
  leftTorsoHp: {} as ItemUpdate,
  poison: {} as ItemUpdate,
  rads: {} as ItemUpdate,
  rightArmHp: {} as ItemUpdate,
  rightLegHp: {} as ItemUpdate,
  rightTorsoHp: {} as ItemUpdate
}

export type HealthUpdatePayload = {
  id: keyof typeof defaultHealthUpdate
  count: number
  label: string
  initValue: number
}

export type StatusUpdateState = typeof defaultHealthUpdate

export type UpdateHealthAction =
  | { type: "mod"; payload: HealthUpdatePayload }
  | { type: "reset"; payload?: undefined }

const healthReducer = (
  state: StatusUpdateState,
  { type, payload }: UpdateHealthAction
): StatusUpdateState => {
  switch (type) {
    case "mod": {
      const { id, count, label, initValue } = payload
      const prevValue = state[id]?.count ?? 0
      let newValue = prevValue + count
      if (initValue + newValue < healthMap[id].minValue) {
        newValue = -initValue
      }
      return { ...state, [id]: { count: newValue, label, initValue } }
    }

    case "reset": {
      return defaultHealthUpdate
    }

    default: {
      throw Error(`Unknown action : ${type}`)
    }
  }
}

export default healthReducer
