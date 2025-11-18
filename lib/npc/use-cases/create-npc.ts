import { DbPlayable } from "lib/character/Playable"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { getExpForLevel } from "lib/character/status/status-calc"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"
import { getSquad } from "lib/squad/use-cases/sub-squad"

import { CreateNpcForm } from "../create-npc-store"
import {
  formToDbCharInfo,
  getDbHealth,
  getSpecialFromTemplate,
  getTagSkillsFromTemplate,
  getTraitsFromTemplate,
  getUpSkillsScores
} from "../utils/npc-generation"

export type CreateNpcParams = {
  npc: CreateNpcForm
  squadId: string
}

export default function createNpc({ db, store }: UseCasesConfig) {
  const playableRepo = repositoryMap[db].playableRepository
  const squadRepo = repositoryMap[db].squadRepository

  return async ({ npc, squadId }: CreateNpcParams) => {
    const baseSPECIAL = getSpecialFromTemplate(npc.templateId)
    const traits = getTraitsFromTemplate(npc.templateId)
    const tagSkills = getTagSkillsFromTemplate(npc.level, npc.templateId)
    const abilities = {
      baseSPECIAL,
      upSkills: getUpSkillsScores(npc.level, tagSkills, baseSPECIAL, traits),
      traits: Object.fromEntries(traits.map(t => [t, t])),
      knowledges: {} as Record<KnowledgeId, KnowledgeLevelValue>
    }
    const exp = getExpForLevel(npc.level)
    const payload: DbPlayable = {
      info: formToDbCharInfo(npc, squadId),
      abilities,
      exp,
      combatStatus: { currAp: 0 },
      inventory: { caps: 0, items: {} },
      health: getDbHealth(exp, baseSPECIAL, npc.templateId)
    }

    const creationRef = await playableRepo.add({}, payload)
    const key = creationRef?.key
    if (!key) throw new Error("Failed to create NPC")
    const squad = getSquad(store, squadId)
    const prevNpcs = squad.npcs
    const newNpcs = { ...prevNpcs, [key]: key }
    return squadRepo.patchChild({ id: squadId, childKey: "npc" }, newNpcs)
  }
}
