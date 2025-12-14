import { SectionList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useAbilities } from "lib/character/abilities/abilities-provider"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { knowledgesByCategory } from "lib/character/abilities/knowledges/knowledges"
import {
  BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES,
  knowledgesCategoryLabel
} from "lib/character/abilities/knowledges/knowledges-const"
import UpdateKnowledgeRow, {
  ListHeader
} from "lib/character/abilities/knowledges/ui/UpdateKnowledgeRow"
import useUpdateKnowledges from "lib/character/abilities/knowledges/ui/useUpdateKnowledges"
import { useCharInfo } from "lib/character/info/info-provider"
import { useProgress } from "lib/character/progress/progress-provider"

import ModalCta from "components/ModalCta/ModalCta"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import colors from "styles/colors"

export default function UpdateKnowledgesModal() {
  const params = useLocalSearchParams<{
    isFreeKnowledges?: string
    charId: string
    squadId: string
  }>()
  const { charId, squadId } = params
  const isFreeKnowledges = params.isFreeKnowledges === "true"

  const progress = useProgress(charId)
  const { data: background } = useCharInfo(charId, i => i.background)
  const { data: knowledgesRecord } = useAbilities(charId, a => a.knowledges)

  const { availableFreeKnowledgePoints, availableKnowledgePoints } = progress

  const freeCategories = BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES[background]
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
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/update-knowledges-confirmation",
      params: { charId, squadId }
    })
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
              initValue={knowledgesRecord[item.id] ?? 0}
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
