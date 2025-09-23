import repositoryMap from "lib/shared/db/get-repository"

export type UpdateExpParams = {
  charId: string
  newExp: number
}

export default function updateExp(dbType: keyof typeof repositoryMap = "rtdb") {
  const playableRepo = repositoryMap[dbType].playableRepository

  return ({ charId, newExp }: UpdateExpParams) =>
    playableRepo.setChild({ id: charId, childKey: "exp" }, newExp)
}
