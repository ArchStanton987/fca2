import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useActionApi, useActionSubtype } from "providers/ActionFormProvider"
import colors from "styles/colors"

const title = "pa"

export default function ItemActions({ charId }: { charId: string }) {
  const actionSubtype = useActionSubtype()
  const { setActionSubtype } = useActionApi()
  const { data: currAp } = useCombatStatus(charId, s => s.currAp)

  return (
    <ScrollSection style={{ flex: 1 }} title={title}>
      <List
        data={Object.values(actions.item.subtypes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const disabled = currAp < item.apCost
          return (
            <ListItemSelectable
              isSelected={actionSubtype === item.id}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => setActionSubtype(item.id, item.apCost)}
              disabled={currAp < item.apCost}
            >
              <Txt style={disabled && { color: colors.terColor }}>{item.label}</Txt>
              <Txt style={disabled && { color: colors.terColor }}>{item.apCost}</Txt>
            </ListItemSelectable>
          )
        }}
      />
    </ScrollSection>
  )
}
