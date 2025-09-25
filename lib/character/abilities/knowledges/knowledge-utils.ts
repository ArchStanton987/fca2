import Abilities from "../Abilities"
import { KnowledgeId } from "./knowledge-types"
import knowledgeLevels from "./knowledges-levels"

/* eslint-disable import/prefer-default-export */
export const getKnowledgesBonus = (
  knowledgesIds: KnowledgeId[],
  knowledges: Abilities["knowledges"]
) =>
  knowledgesIds.reduce((acc, curr) => {
    const knowledgeLevel = knowledges[curr]
    const knowledgeBonus = knowledgeLevels.find(el => el.id === knowledgeLevel)?.bonus || 0
    return acc + knowledgeBonus
  }, 0)
