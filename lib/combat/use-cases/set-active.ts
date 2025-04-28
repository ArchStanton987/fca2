// import Playable from "lib/character/Playable"
// import repositoryMap from "lib/shared/db/get-repository"

// export type SetActiveFightParams = {
//   combatId: string
//   players: Record<string, Playable>
//   enemies: Record<string, Playable>
// }

// export default function setActive(dbType: keyof typeof repositoryMap = "rtdb") {
//   const combatRepo = repositoryMap[dbType].combatRepository
//   const statusRepo = repositoryMap[dbType].statusRepository

//   return ({ combatId, players, enemies }: SetActiveFightParams) => {
//     const promises = []
//     // for each player and enemy, set the combatStatus to active, set the currentCombatId and reset AP
//     Object.entries({ players, enemies }).forEach(([type, contenders]) => {
//       Object.entries(contenders).forEach(([charId, playable]) => {
//         const charType = type === "players" ? ("characters" as const) : ("npcs" as const)
//         const currMaxAp = playable.secAttr.curr.actionPoints
//         const s = { combatStatus: "active" as const, currentCombatId: combatId, currAp: currMaxAp }
//         promises.push(statusRepo.patch({ charId, charType }, s))
//       })
//     })
//   }
// }
