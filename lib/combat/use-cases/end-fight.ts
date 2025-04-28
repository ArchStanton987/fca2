// import { ThenableReference } from "firebase/database"
// import { DbStatus } from "lib/character/status/status.types"
// import repositoryMap from "lib/shared/db/get-repository"

// export type CloseFightParams = {
//   id: string
//   players: Record<string, { currMaxAp: number }>
//   enemies: Record<string, { currMaxAp: number }>
// }

// export default function closeFight(dbType: keyof typeof repositoryMap = "rtdb") {
//   const statusRepo = repositoryMap[dbType].statusRepository
//   const characterRepo = repositoryMap[dbType].characterRepository

//   return (params: CloseFightParams) => {
//     const promises: (Promise<void> | ThenableReference)[] = []
//     // update status of all characters : reset AP, reset currFightId, reset combatStatus
//     // add fight ID in characters combat archive
//     Object.entries({ players: params.players, enemies: params.enemies }).forEach(
//       ([type, contenders]) => {
//         Object.entries(contenders).forEach(([id, { currMaxAp }]) => {
//           const charType = type === "players" ? ("characters" as const) : ("enemies" as const)
//           const patchedStatus: Partial<DbStatus> = {
//             combatStatus: undefined,
//             currentCombatId: undefined,
//             currAp: currMaxAp
//           }
//           promises.push(statusRepo.patch({ charId: id, charType }, patchedStatus))
//           promises.push(
//             characterRepo.addChild(
//               { charType, id, childKey: "combats", childId: params.id },
//               params.id
//             )
//           )
//         })
//       }
//     )

//     return Promise.all(promises)
//   }
// }
