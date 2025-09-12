import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"

// const title = [{ title: "action", containerStyle: { flex: 1 } }, { title: "pa" }]
const title = "pa"

export default function PrepareActions() {
  const { actionSubtype, ...rest } = useActionForm()
  const { charId } = useCharacter()
  const { setActionSubtype } = useActionApi()
  const actorId = rest.actorId === "" ? charId : rest.actorId
  const { currAp } = useCombatStatuses(actorId)
  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.prepare.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItemSelectable
            isSelected={actionSubtype === item.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
            onPress={() => setActionSubtype(item.id, currAp)}
          >
            <Txt>{item.label}</Txt>
            <Txt>{currAp}</Txt>
          </ListItemSelectable>
        )}
      />
    </ScrollSection>
  )
}
