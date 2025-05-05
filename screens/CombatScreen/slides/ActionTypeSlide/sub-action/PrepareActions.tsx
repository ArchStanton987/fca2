import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"

// const title = [{ title: "action", containerStyle: { flex: 1 } }, { title: "pa" }]
const title = "pa"

export default function PrepareActions() {
  const { status } = useCharacter()
  const { actionSubtype } = useActionForm()
  const { setActionSubtype } = useActionApi()
  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.prepare.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItemSelectable
            isSelected={actionSubtype === item.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
            onPress={() => setActionSubtype(item.id)}
          >
            <Txt>{item.label}</Txt>
            <Txt>{status.currAp}</Txt>
          </ListItemSelectable>
        )}
      />
    </ScrollSection>
  )
}
