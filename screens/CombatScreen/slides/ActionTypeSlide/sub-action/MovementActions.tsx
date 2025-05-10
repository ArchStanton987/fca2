import actions from "lib/combat/const/actions"
import getUseCases from "lib/get-use-cases"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import colors from "styles/colors"

const title = "action / pa / dist"

export default function MovementActions() {
  const useCases = getUseCases()
  const { status } = useCharacter()
  const { combat } = useCombat()
  const { actionSubtype } = useActionForm()
  const { setActionSubtype, setForm } = useActionApi()

  const onPressElement = (id: keyof typeof actions.movement.subtypes) => {
    if (!combat) throw new Error("No combat found")
    setActionSubtype(id)
    const apCost = actions.movement.subtypes[id].apCost ?? status.currAp
    setForm({ apCost })
    useCases.combat.updateAction({ combat, payload: { apCost } })
  }

  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.movement.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const disabled = typeof item.apCost === "number" && status.currAp < item.apCost
          return (
            <ListItemSelectable
              isSelected={actionSubtype === item.id}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => onPressElement(item.id)}
              disabled={disabled}
            >
              <Txt style={[{ flex: 1 }, disabled && { color: colors.terColor }]}>{item.label}</Txt>
              <Txt style={disabled && { color: colors.terColor }}>{item.apCost ?? "-"}</Txt>
              <Txt
                style={[{ width: 60, textAlign: "right" }, disabled && { color: colors.terColor }]}
              >
                {item.distance}
              </Txt>
            </ListItemSelectable>
          )
        }}
      />
    </ScrollSection>
  )
}
