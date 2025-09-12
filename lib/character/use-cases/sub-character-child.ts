import { PlayableParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

import { DbChar } from "../Character"

export type SubCharacterChildParams<T> = PlayableParams & {
  id: string
  childKey: T
}

export default function subCharacterChild(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].playableRepository
  return <T extends keyof DbChar>(params: SubCharacterChildParams<T>) =>
    repository.subChild({
      id: params.id,
      childKey: params.childKey
    })
}
