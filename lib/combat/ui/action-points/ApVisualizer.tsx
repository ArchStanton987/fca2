import { StyleSheet } from "react-native"

import CheckBox from "components/CheckBox/CheckBox"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 15
  }
})

export default function ApVisualizer() {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const { status, secAttr, charId } = character
  const { currAp } = status
  const maxAp = secAttr.curr.actionPoints

  const { combat } = useCombat()
  const actorId = combat?.currAction?.actorId
  const targetId = combat?.currAction?.targetId
  const isActor = actorId === charId
  const isTarget = targetId === charId
  let apCost = 0
  if (isActor) apCost = combat?.currAction?.apCost ?? 0
  if (isTarget && combat?.currAction?.reactionRoll) {
    apCost = combat?.currAction?.reactionRoll?.opponentApCost ?? 0
  }

  const handleSetAp = async (i: number) => {
    const newValue = i < currAp ? i : i + 1
    await useCases.status.updateElement(character, "currAp", newValue)
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    const isChecked = i < currAp
    const isPreview = i >= currAp - apCost && i < currAp
    apArr.push({ id: i.toString(), isChecked, isPreview })
  }

  return (
    <Section title={`Points d'action : ${currAp} / ${maxAp}`}>
      <List
        data={apArr}
        horizontal
        style={styles.checkboxContainer}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CheckBox
            color={item.isPreview ? colors.yellow : colors.secColor}
            size={30}
            isChecked={item.isChecked}
            onPress={() => handleSetAp(parseInt(item.id, 10))}
          />
        )}
      />
      <Spacer y={layout.globalPadding} />
    </Section>
  )
}
