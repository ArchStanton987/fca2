import { StyleSheet, TouchableOpacity } from "react-native"

import Col from "components/Col"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useCombatStatus } from "providers/CombatStatusesProvider"
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
  const { scrollTo } = useScrollTo()

  const useCases = useGetUseCases()
  const { combat, players, npcs } = useCombat()
  const character = useCharacter()
  const contenders = { ...players, ...npcs }
  const form = useActionForm()
  const { targetId } = form
  const actorId = form.actorId === "" ? character.charId : form.actorId
  const actor = contenders[actorId]
  const { isEnemy } = actor.meta

  const { setForm } = useActionApi()

  const combatStatuses = useCombatStatus()

  const onPressPlayer = (id: string) => {
    setForm({ targetId: id })
  }

  const submit = () => {
    if (!combat) return
    useCases.combat.updateAction({ combat, payload: { targetId } })
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
      isEnemy: contenders[id].meta.isEnemy,
      fullname: contenders[id].fullname
    }))

  const hostiles = aliveContenders.filter(c => (isEnemy ? !c.isEnemy : c.isEnemy))
  const nonHostiles = aliveContenders.filter(c => (isEnemy ? c.isEnemy : !c.isEnemy))
  const targetList = [...hostiles, { fullname: "autre", id: "other" }, ...nonHostiles]

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
