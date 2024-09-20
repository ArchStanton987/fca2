import { useState } from "react"
import { Alert } from "react-native"

import { KnowledgeId, KnowledgeLevel } from "lib/character/abilities/knowledges/knowledge-types"
import knowledgesMap from "lib/character/abilities/knowledges/knowledges"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import { getUsedKnowledgesPoints } from "lib/character/progress/progress-utils"
import useCases from "lib/common/use-cases"
import { CharStackScreenProps } from "nav/nav.types"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"
import KnowledgeRow from "screens/MainTabs/KnowledgesScreen/KnowledgeRow"

export default function UpdateKnowledgesModal({
  navigation
}: CharStackScreenProps<"UpdateKnowledges">) {
  const { progress, knowledgesRecord, charId } = useCharacter()
  const { availableKnowledgePoints, usedKnowledgePoints } = progress

  const [newKnowledges, setNewKnowledges] = useState(knowledgesRecord)

  const assignedCount = getUsedKnowledgesPoints(newKnowledges)
  const toAssignCount = usedKnowledgePoints + availableKnowledgePoints - assignedCount

  const onModKnowledge = (id: KnowledgeId, newLevel: KnowledgeLevel) => {
    // prevent from setting knowledge lower than actual current level
    if (newLevel.id < knowledgesRecord[id]) return
    // prevent from setting knowledge higher than available points
    const currLevelCost = knowledgeLevels.find(lvl => lvl.id === knowledgesRecord[id])?.cost ?? 0
    const updateCost = newLevel.cost - currLevelCost
    if (toAssignCount < updateCost) return
    // handle clear new knowledge
    const level = newLevel.id > (newKnowledges[id] || 0) ? newLevel.id : newLevel.id - 1
    const isDelete = level === 0
    if (isDelete) {
      setNewKnowledges(prev => {
        const newRecord = { ...prev }
        delete newRecord[id]
        return newRecord
      })
      return
    }
    setNewKnowledges(prev => ({ ...prev, [id]: level }))
  }

  const onCancel = () => navigation.goBack()
  const onConfirm = () => {
    Alert.prompt("Confirmation", "Voulez-vous vraiment valider ces modifications ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Confirmer",
        onPress: async () => {
          await useCases.abilities.updateKnowledges(charId, newKnowledges)
          navigation.goBack()
        }
      }
    ])
  }

  return (
    <ModalBody>
      <Txt style={{ textAlign: "center" }}>
        Points de connaissances à répartir : {toAssignCount}
      </Txt>
      <Spacer y={20} />
      <ScrollableSection title="CONNAISSANCES" style={{ flex: 1 }}>
        {Object.values(knowledgesMap).map(({ id }) => {
          const value = newKnowledges[id] ?? 0
          return <KnowledgeRow isEditable onPress={onModKnowledge} knowledge={{ id, value }} />
        })}
      </ScrollableSection>
      <ModalCta onPressCancel={onCancel} onPressConfirm={onConfirm} />
    </ModalBody>
  )
}
