/* eslint-disable import/prefer-default-export */
import { useAbilities } from "../abilities/abilities-provider"
import { useCharInfo } from "../info/info-provider"
import Progress from "./Progress"
import { useExp } from "./exp-provider"

export function useProgress(id: string) {
  const abilities = useAbilities(id)
  const exp = useExp(id)
  const charInfo = useCharInfo(id)
  return new Progress(exp.data, abilities.data, charInfo.data)
}
