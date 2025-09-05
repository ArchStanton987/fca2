import actions from "lib/combat/const/actions"

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
  const { actionSubtype, ...rest } = useActionForm()
  const { setActionSubtype } = useActionApi()
  const { charId } = useCharacter()
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const actorId = rest.actorId === "" ? charId : rest.actorId
  const { status } = contenders[actorId].char

  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.movement.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const disabled = typeof item.apCost === "number" && status.currAp < item.apCost
          const apCost = actions.movement.subtypes[item.id].apCost ?? status.currAp
          return (
            <ListItemSelectable
              isSelected={actionSubtype === item.id}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => setActionSubtype(item.id, apCost)}
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
