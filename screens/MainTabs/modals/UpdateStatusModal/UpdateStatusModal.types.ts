import { DbStatus } from "lib/character/status/status.types"

export type UpdatableStatusElement = Extract<keyof DbStatus, "exp">

export type UpdateStatusState = Record<UpdatableStatusElement, { count: number; initValue: number }>
