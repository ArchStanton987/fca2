import { DbPlayable } from "lib/character/Playable"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { getExpForLevel } from "lib/character/status/status-calc"
import { UseCasesConfig } from "lib/get-use-case.types"
import barter from "lib/inventory/use-cases/barter"
import repositoryMap from "lib/shared/db/get-repository"
import { getSquad } from "lib/squad/use-cases/sub-squad"

import humanTemplates from "../const/human-templates"
import { CreateNpcForm } from "../create-npc-store"
import {
  formToDbCharInfo,
  getDbHealth,
  getEquippedObjects,
  getSpecialFromTemplate,
  getTagSkillsFromTemplate,
  getTraitsFromTemplate,
  getUpSkillsScores
} from "../utils/npc-generation"

export type CreateNpcParams = {
  npc: CreateNpcForm
  squadId: string
}

export default function createNpc(config: UseCasesConfig) {
  const { db, store } = config
  const playableRepo = repositoryMap[db].playableRepository
  const squadRepo = repositoryMap[db].squadRepository

  return async ({ npc, squadId }: CreateNpcParams) => {
    const level = parseInt(npc.level, 10)
    if (Number.isNaN(level)) {
      throw new Error("Invalid level")
    }

    const baseSPECIAL = getSpecialFromTemplate(npc.templateId)
    const traits = getTraitsFromTemplate(npc.templateId)
    const tagSkills = getTagSkillsFromTemplate(level, npc.templateId)
    const abilities = {
      baseSPECIAL,
      upSkills: getUpSkillsScores(level, tagSkills, baseSPECIAL, traits),
      traits: Object.fromEntries(traits.map(t => [t, t])),
      knowledges: {} as Record<KnowledgeId, KnowledgeLevelValue>
    }
    const exp = getExpForLevel(level)
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

    if (!payload.info.isCritter) {
      const items = getEquippedObjects(
        level,
        tagSkills,
        humanTemplates[npc.templateId]?.weaponTags ?? []
      )
      await barter(config)({ charId: key, caps: 0, ammo: {}, items })
    }

    const squad = getSquad(store, squadId)
    const prevNpcs = squad.npcs
    const newNpcs = { ...prevNpcs, [key]: key }
    await squadRepo.patchChild({ id: squadId, childKey: "npc" }, newNpcs)
  }
}
