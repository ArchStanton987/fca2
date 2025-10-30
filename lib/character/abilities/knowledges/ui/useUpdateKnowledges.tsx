import { useState } from "react"

import {
  KnowledgeId,
  KnowledgeLevel,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import { getAssignedRawKPoints } from "lib/character/progress/progress-utils"

type Params = {
  initKnowledgesRecord: Partial<Record<KnowledgeId, KnowledgeLevelValue>>
  initAvailablePoints: number
}

export default function useUpdateKnowledges(params: Params) {
  const { initKnowledgesRecord, initAvailablePoints } = params

  const [newKnowledges, setNewKnowledges] = useState(initKnowledgesRecord)

  const initUsedPoints = getAssignedRawKPoints(initKnowledgesRecord)
  const currUsedPoints = getAssignedRawKPoints(newKnowledges)

  const remainingPoints = initAvailablePoints + initUsedPoints - currUsedPoints

  const onModKnowledge = (id: KnowledgeId, newLevel: KnowledgeLevel) => {
    // prevent from setting knowledge lower than actual current level
    if (initKnowledgesRecord[id] && newLevel.id < initKnowledgesRecord[id]) return
    // prevent from setting knowledge higher than available points
    const currLvlCost = knowledgeLevels.find(lvl => lvl.id === newKnowledges[id])?.cost ?? 0
    const updateCost = newLevel.cost - currLvlCost
    if (updateCost > remainingPoints) return
    // handle clear new knowledge
    const level = updateCost > 0 ? newLevel.id : newLevel.id - 1
    const shouldDelete = level === 0
    if (shouldDelete) {
      setNewKnowledges(prev => {
        const newRecord = { ...prev }
        delete newRecord[id]
        return newRecord
      })
      return
    }
    setNewKnowledges(prev => ({ ...prev, [id]: level }))
  }

  return [newKnowledges, onModKnowledge, remainingPoints] as const
}
