import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionActorId, useActionApi, useActionSubtype } from "providers/ActionFormProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import colors from "styles/colors"

const title = "action / pa / dist"

export default function MovementActions() {
  const formActorId = useActionActorId()
  const actionSubtype = useActionSubtype()
  const { charId } = useCharacter()
  const { setActionSubtype } = useActionApi()
  const actorId = formActorId === "" ? charId : formActorId
  const { currAp } = useCombatStatuses(actorId)

  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.movement.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const disabled = typeof item.apCost === "number" && currAp < item.apCost
          const apCost = actions.movement.subtypes[item.id].apCost ?? currAp
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
