import Playable from "lib/character/Playable"

import { KnowledgeId } from "./knowledge-types"
import knowledgeLevels from "./knowledges-levels"

/* eslint-disable import/prefer-default-export */
export const getKnowledgesBonus = (knowledgesIds: KnowledgeId[], char: Playable) =>
  knowledgesIds.reduce((acc, curr) => {
    const knowledgeLevel = char.knowledgesRecord[curr]
    const knowledgeBonus = knowledgeLevels.find(el => el.id === knowledgeLevel)?.bonus || 0
    return acc + knowledgeBonus
  }, 0)
