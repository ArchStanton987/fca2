import { StyleSheet, TouchableOpacity } from "react-native"

import { useContendersCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"

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
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
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

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }
  const useCases = useGetUseCases()
  const { meta, charId } = useCharacter()
  const { isEnemy } = meta
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const contendersIds = Object.keys(contenders)

  const { targetId } = useActionForm()
  const { setForm } = useActionApi()

  const allCombatStatus = useContendersCombatStatus(contendersIds)

  const onPressPlayer = (id: string) => {
    setForm({ targetId: id })
  }

  const submit = () => {
    if (!combat) return
    useCases.combat.updateAction({ combat, payload: { targetId } })
    scrollNext?.()
  }

  if (allCombatStatus.some(e => e.isLoading)) return <LoadingScreen />

  const aliveContenders = Object.values(contenders).filter((c, i) => {
    const isAlive = allCombatStatus[i].data?.combatStatus !== "dead"
    const isNotCurrPlayer = c.charId !== charId
    return isAlive && isNotCurrPlayer
  })
  const hostiles = Object.values(aliveContenders).filter(c =>
    isEnemy ? !c.meta.isEnemy : c.meta.isEnemy
  )
  const nonHostiles = Object.values(aliveContenders).filter(c =>
    isEnemy ? c.meta.isEnemy : !c.meta.isEnemy
  )
  const targetList = [...hostiles, { fullname: "autre", charId: "other" }, ...nonHostiles]

  return (
    <DrawerSlide>
      <ScrollSection title="choisissez la cible" style={{ flex: 1 }}>
        <List
          data={targetList}
          keyExtractor={e => e.charId}
          separator={<Spacer y={15} />}
          renderItem={({ item }) => {
            const isSelected = targetId === item.charId
            return (
              <TouchableOpacity
                onPress={() => onPressPlayer(item.charId)}
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
