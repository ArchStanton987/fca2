import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useActionApi, useActionForm } from "providers/ActionProvider"

const title = "action / pa / dist"

export default function MovementActions() {
  const { actionSubtype } = useActionForm()
  const { setActionSubtype } = useActionApi()
  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.movement.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItemSelectable
            isSelected={actionSubtype === item.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
            onPress={() => setActionSubtype(item.id)}
          >
            <Txt style={{ flex: 1 }}>{item.label}</Txt>
            <Txt>{item.apCost ?? "-"}</Txt>
            <Txt style={{ width: 60, textAlign: "right" }}>{item.distance}</Txt>
          </ListItemSelectable>
        )}
      />
    </ScrollSection>
  )
}
