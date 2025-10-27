import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useActionApi, useActionSubtype } from "providers/ActionFormProvider"

// const title = [{ title: "action", containerStyle: { flex: 1 } }, { title: "pa" }]
const title = "pa"

export default function PrepareActions({ charId }: { charId: string }) {
  const actionSubtype = useActionSubtype()
  const { setActionSubtype } = useActionApi()
  const { data: currAp } = useCombatStatus(charId, s => s.currAp)
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
