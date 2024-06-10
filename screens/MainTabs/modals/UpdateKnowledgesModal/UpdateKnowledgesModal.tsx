import { useState } from "react"

import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import { getUsedKnowledgesPoints } from "lib/character/progress/progress-utils"

import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"

export default function UpdateKnowledgesModal() {
  const { progress, knowledgesRecord } = useCharacter()
  const { availableKnowledgePoints, usedKnowledgePoints } = progress

  const [newKnowledges, setNewKnowledges] = useState(knowledgesRecord)

  const assignedCount = getUsedKnowledgesPoints(newKnowledges)
  const toAssignCount = usedKnowledgePoints + availableKnowledgePoints - assignedCount

  const onModKnowledge = (modType: "plus" | "minus", knowledgeId: KnowledgeId) => {
    if (toAssignCount === 0 && modType === "plus") return
    if (modType === "minus" && newKnowledges[knowledgeId] === knowledgesRecord[knowledgeId]) return
  }

  return (
    <ModalBody>
      <Txt style={{ textAlign: "center" }}>
        Points de connaissances à répartir : {toAssignCount}
      </Txt>
    </ModalBody>
  )
}
