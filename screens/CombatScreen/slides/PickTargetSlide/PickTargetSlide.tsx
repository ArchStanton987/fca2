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
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "../NextButton"

const styles = StyleSheet.create({
  button: {
    padding: 15,
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

export default function PickTargetSlide({ scrollNext }: SlideProps) {
  const useCases = useGetUseCases()
  const { meta } = useCharacter()
  const { isEnemy } = meta
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }

  const { targetId } = useActionForm()
  const { setForm } = useActionApi()

  const onPressPlayer = (id: string) => {
    setForm({ targetId: id })
  }

  const submit = () => {
    if (!combat) return
    useCases.combat.updateAction({ combat, payload: { targetId } })
    scrollNext?.()
  }

  const hostiles = Object.values(contenders).filter(c =>
    isEnemy ? !c.char.meta.isEnemy : c.char.meta.isEnemy
  )
  const nonHostiles = Object.values(contenders).filter(c =>
    isEnemy ? c.char.meta.isEnemy : !c.char.meta.isEnemy
  )
  const targetList = [...hostiles, { char: { fullname: "autre", charId: "other" } }, ...nonHostiles]

  return (
    <DrawerSlide>
      <ScrollSection title="choisissez la cible" style={{ flex: 1 }}>
        <List
          data={targetList}
          keyExtractor={e => e.char.charId}
          separator={<Spacer y={15} />}
          renderItem={({ item }) => {
            const isSelected = targetId === item.char.charId
            return (
              <TouchableOpacity
                onPress={() => onPressPlayer(item.char.charId)}
                style={[styles.button, isSelected && styles.selected]}
              >
                <Txt>{item.char.fullname}</Txt>
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
