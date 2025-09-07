import { CharacterParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

import { DbChar } from "../Character"

export type SubCharacterChildParams<T> = CharacterParams & {
  id: string
  childKey: T
}

export default function subCharacterChild(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].characterRepository
  return <T extends keyof DbChar>(params: SubCharacterChildParams<T>) =>
    repository.subChild<T>({
      id: params.id,
      childKey: params.childKey
    })
}
