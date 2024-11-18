import { SectionList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { knowledgesByCategory } from "lib/character/abilities/knowledges/knowledges"
import {
  BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES,
  knowledgesCategoryLabel
} from "lib/character/abilities/knowledges/knowledges-const"

import ModalCta from "components/ModalCta/ModalCta"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

import UpdateKnowledgeRow, { ListHeader } from "./UpdateKnowledgeRow"
import useUpdateKnowledges from "./useUpdateKnowledges"

export default function UpdateKnowledgesModal() {
  const screenParams = useLocalSearchParams<{ isFreeKnowledges: string }>()
  const isFreeKnowledges = screenParams.isFreeKnowledges === "true"

  const { progress, knowledgesRecord, charId, squadId, status } = useCharacter()
  const { availableFreeKnowledgePoints, availableKnowledgePoints } = progress

  const freeCategories = BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES[status.background]
  const freeCategoriesIds = freeCategories.map(cat => cat.id)
  const freeCategoriesKnowledges = knowledgesByCategory.filter(cat =>
    freeCategoriesIds.includes(cat.title)
  )
  const sectionList = isFreeKnowledges ? freeCategoriesKnowledges : knowledgesByCategory

  const kParams = {
    initKnowledgesRecord: knowledgesRecord,
    initAvailablePoints: isFreeKnowledges ? availableFreeKnowledgePoints : availableKnowledgePoints
  }
  const [newKnowledges, onModKnowledge, remainingPoints] = useUpdateKnowledges(kParams)

  const onCancel = () => router.dismiss(1)
  const handleNext = () => {
    const modifiedKnowledges = {} as Record<KnowledgeId, KnowledgeLevelValue>
    Object.entries(newKnowledges).forEach(([k, value]) => {
      const id = k as KnowledgeId
      const prevKnowledge = knowledgesRecord[id] ?? 0
      if (prevKnowledge >= value) return
      modifiedKnowledges[id] = value
    })
    const params = {
      charId,
      squadId,
      modifiedKnowledges: JSON.stringify(modifiedKnowledges)
    }
    router.push({ pathname: routes.modal.updateKnowledgesConfirmation, params })
  }

  return (
    <ModalBody>
      {isFreeKnowledges ? (
        <Txt style={{ textAlign: "center" }}>
          Grâce à vos origines, vous avez des points de connaissances gratuits à répartir.
        </Txt>
      ) : null}
      <Txt style={{ textAlign: "center" }}>
        Points de connaissances {isFreeKnowledges ? "gratuits" : ""} à répartir : {remainingPoints}
      </Txt>
      <Spacer y={20} />
      <ListHeader />
      <SectionList
        sections={sectionList}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View style={{ backgroundColor: colors.terColor }}>
            <Txt style={{ textAlign: "center", color: colors.secColor, padding: 6 }}>
              {knowledgesCategoryLabel[section.title]}
            </Txt>
          </View>
        )}
        renderItem={({ item }) => {
          const currValue = newKnowledges[item.id] ?? 0
          return (
            <UpdateKnowledgeRow
              id={item.id}
              initValue={knowledgesRecord[item.id]}
              currValue={currValue}
              availablePoints={remainingPoints}
              onPress={onModKnowledge}
            />
          )
        }}
      />

      <ModalCta onPressCancel={onCancel} onPressConfirm={handleNext} />
    </ModalBody>
  )
}
