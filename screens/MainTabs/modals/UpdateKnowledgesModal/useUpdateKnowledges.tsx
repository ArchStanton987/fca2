import { useState } from "react"

import {
  KnowledgeId,
  KnowledgeLevel,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import {
  getRawUsedKnowledgePoints,
  getUsedKnowledgesPoints
} from "lib/character/progress/progress-utils"
import { BackgroundId } from "lib/character/status/status.types"

type Params = {
  initKnowledgesRecord: Record<KnowledgeId, KnowledgeLevelValue>
  initAvailablePoints: number
  charBackground?: BackgroundId
}

export default function useUpdateKnowledges(params: Params) {
  const { initKnowledgesRecord, initAvailablePoints, charBackground } = params

  const [newKnowledges, setNewKnowledges] = useState(initKnowledgesRecord)

  let initUsedPoints
  let currUsedPoints

  if (charBackground) {
    initUsedPoints = getUsedKnowledgesPoints(initKnowledgesRecord, charBackground)
    currUsedPoints = getUsedKnowledgesPoints(newKnowledges, charBackground)
  } else {
    initUsedPoints = getRawUsedKnowledgePoints(initKnowledgesRecord)
    currUsedPoints = getRawUsedKnowledgePoints(newKnowledges)
  }
  const remainingPoints = initAvailablePoints + initUsedPoints - currUsedPoints

  const onModKnowledge = (id: KnowledgeId, newLevel: KnowledgeLevel) => {
    // prevent from setting knowledge lower than actual current level
    if (newLevel.id < initKnowledgesRecord[id]) return
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
