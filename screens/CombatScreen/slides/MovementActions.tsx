import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"

type WeaponActionsProps = {
  selectedAction: string
  onPress: (action: string) => void
}

const title = [{ title: "action", containerStyle: { flex: 1 } }, { title: "pa" }, { title: "dist" }]

export default function MovementActions({ selectedAction, onPress }: WeaponActionsProps) {
  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.movement.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItemSelectable
            isSelected={selectedAction === item.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
            onPress={() => onPress(item.id)}
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
