import { UpdatableStatusElement } from "lib/character/status/status.types"

export type UpdateStatusModalParams = {
  charId: string
  squadId: string
  initCategory: UpdatableStatusElement
}
