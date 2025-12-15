import { StyleSheet, TouchableOpacity } from "react-native"

import { useCurrCharId } from "lib/character/character-store"
import { useCombatId, useCombatStatuses } from "lib/character/combat-status/combat-status-provider"
import { useCharInfo, usePlayablesCharInfo } from "lib/character/info/info-provider"
import { useContenders } from "lib/combat/use-cases/sub-combats"

import Col from "components/Col"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import {
  useActionActorId,
  useActionApi,
  useActionSubtype,
  useActionTargetId
} from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "../NextButton"

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderColor: colors.secColor
  },
  selected: {
    backgroundColor: colors.terColor
  },
  centeredSection: {
    justifyContent: "center",
    alignItems: "center"
  }
})

export default function PickTargetSlide({ slideIndex }: SlideProps) {
  const charId = useCurrCharId()
  const { scrollTo } = useScrollTo()

  const useCases = useGetUseCases()
  const targetId = useActionTargetId()
  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId

  const { data: combatId } = useCombatId(actorId)
  const { data: contendersIds } = useContenders(combatId)
  const { data: isEnemy } = useCharInfo(charId, i => i.isEnemy)
  const isAimAttack = useActionSubtype() === "aim"
  const combatStatuses = useCombatStatuses(contendersIds)
  const contendersInfo = usePlayablesCharInfo(contendersIds)

  const { setForm } = useActionApi()

  const onPressPlayer = (id: string) => {
    setForm({ targetId: id })
  }

  const submit = () => {
    if (!targetId) return
    useCases.combat.pickTarget({ combatId, targetId })
    scrollTo(slideIndex + 1)
  }

  const aliveContenders = Object.entries(combatStatuses)
    .filter(([id, cs]) => {
      const isAlive = cs.combatStatus !== "dead"
      const isNotCurrPlayer = id !== actorId
      return isAlive && isNotCurrPlayer
    })
    .map(([id]) => ({
      id,
      isEnemy: contendersInfo[id].isEnemy,
      fullname: contendersInfo[id].fullname
    }))

  const hostiles = aliveContenders.filter(c => (isEnemy ? !c.isEnemy : c.isEnemy))
  const nonHostiles = aliveContenders.filter(c => (isEnemy ? c.isEnemy : !c.isEnemy))
  const targetList = isAimAttack
    ? [...hostiles, ...nonHostiles]
    : [...hostiles, { fullname: "autre", id: "other" }, ...nonHostiles]

  return (
    <DrawerSlide>
      <ScrollSection title="choisissez la cible" style={{ flex: 1 }}>
        <List
          data={targetList}
          keyExtractor={e => e.id}
          separator={<Spacer y={15} />}
          renderItem={({ item }) => {
            const isSelected = targetId === item.id
            return (
              <TouchableOpacity
                onPress={() => onPressPlayer(item.id)}
                style={[styles.button, isSelected && styles.selected]}
              >
                <Txt>{item.fullname}</Txt>
              </TouchableOpacity>
            )
          }}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 200 }}>
        <Section style={{ flex: 1 }}>
          <Spacer y={0} />
        </Section>

        <Spacer y={layout.globalPadding} />

        <Section title="suivant" contentContainerStyle={styles.centeredSection}>
          <NextButton disabled={!targetId} onPress={submit} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
