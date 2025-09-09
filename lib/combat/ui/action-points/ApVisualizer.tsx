import { StyleSheet } from "react-native"

import CheckBox from "components/CheckBox/CheckBox"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useCombat } from "providers/CombatProvider"
import { useCombatStatus } from "providers/CombatStatusesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 15
  }
})

export default function ApVisualizer({ contenderId }: { contenderId: string }) {
  const useCases = useGetUseCases()
  const { npcs, players, combat } = useCombat()
  const contenders = { ...npcs, ...players }
  const contender = contenders[contenderId]
  const maxAp = contender.secAttr.curr.actionPoints
  const { currAp } = useCombatStatus(contenderId)

  const actorId = combat?.currAction?.actorId
  const targetId = combat?.currAction?.targetId
  const isActor = actorId === contenderId
  const isTarget = targetId === contenderId
  let apCost = 0
  if (isActor) apCost = combat?.currAction?.apCost ?? 0
  if (isTarget && combat?.currAction?.reactionRoll) {
    apCost = combat?.currAction?.reactionRoll?.opponentApCost ?? 0
  }

  const handleSetAp = async (i: number) => {
    const newValue = i < currAp ? i : i + 1
    await useCases.character.updateCombatStatus({
      charId: contenderId,
      payload: { currAp: newValue }
    })
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
