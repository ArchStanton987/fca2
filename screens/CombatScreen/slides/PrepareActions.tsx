import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

type PrepareActionProps = {
  selectedAction: string
  onPress: (action: string) => void
}

const title = [{ title: "action", containerStyle: { flex: 1 } }, { title: "pa" }]

export default function PrepareActions({ selectedAction, onPress }: PrepareActionProps) {
  const { status } = useCharacter()
  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.prepare.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItemSelectable
            isSelected={selectedAction === item.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
            onPress={() => onPress(item.id)}
          >
            <Txt>{item.label}</Txt>
            <Txt>{status.currAp}</Txt>
          </ListItemSelectable>
        )}
      />
    </ScrollSection>
  )
}
