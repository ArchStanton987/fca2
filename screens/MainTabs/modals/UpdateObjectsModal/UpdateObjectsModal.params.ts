import { ObjectExchangeState } from "lib/objects/objects-reducer"

export type UpdateObjectsModalParams = {
  charId: string
  squadId: string
  initCategory: keyof ObjectExchangeState
}
