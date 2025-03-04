import { TouchableHighlight } from "react-native"

import { router, useSegments } from "expo-router"

import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import PlusIcon from "components/icons/PlusIcon"
import routes, { charRoute } from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import { UpdateKnowledgesModalParams } from "screens/MainTabs/modals/UpdateKnowledgesModal/UpdateKnowledgesModal.params"
import { toLocalParams } from "screens/ScreenParams"

import styles from "./Drawer.styles"

type SectionId = "main" | "inventory" | "combat"
type DrawerProps = {
  sectionId: SectionId
  navElements: { path: string; label: string }[]
}

export default function Drawer({ sectionId, navElements }: DrawerProps) {
  const segments = useSegments()
  const squad = useSquad()
  const { squadId } = squad
  const { charId, progress } = useCharacter()

  const { availableFreeKnowledgePoints, availableKnowledgePoints, availableSkillPoints } = progress
  const canAddSkill = availableSkillPoints > 0
  const canAddKnowledge = availableKnowledgePoints > 0 || availableFreeKnowledgePoints > 0

  const squadMember = squad.members.find(member => member.id === charId)
  const charDisplayName = squadMember ? squadMember.firstname : "Personnage"

  const toTabs = (path: string) => {
    router.push({
      pathname: `${charRoute}/${sectionId}/${path}`,
      params: { squadId, charId }
    })
  }

  const onLongPress = (hasBadge: boolean, path: string) => {
    if (!hasBadge) return
    const isSkills = path === "skills"
    if (isSkills) {
      router.push({ pathname: routes.modal.updateSkills, params: { charId, squadId } })
    } else {
      const params: UpdateKnowledgesModalParams = {
        charId,
        squadId,
        isFreeKnowledges: availableFreeKnowledgePoints > 0
      }
      router.push({ pathname: routes.modal.updateKnowledges, params: toLocalParams(params) })
    }
  }

  return (
    <ScrollSection style={styles.drawerContainer} title={charDisplayName} titleVariant="shiny">
      <List
        data={navElements}
        keyExtractor={item => item.label}
        style={{ flex: 1 }}
        renderItem={({ item }) => {
          const { path } = item
          const isSelected = segments.includes(path)
          const hasBadge =
            (path === "skills" && canAddSkill) || (path === "knowledges" && canAddKnowledge)
          return (
            <TouchableHighlight
              style={[styles.navButton, isSelected && styles.navButtonActive]}
              onPress={() => toTabs(path)}
              onLongPress={() => onLongPress(hasBadge, path)}
            >
              <>
                <Txt style={[styles.navButtonText, isSelected && styles.navButtonActiveText]}>
                  {item.label}
                </Txt>
                <Spacer x={5} />
                {hasBadge && <PlusIcon style={styles.badge} size={12} />}
              </>
            </TouchableHighlight>
          )
        }}
      />
    </ScrollSection>
  )
}
