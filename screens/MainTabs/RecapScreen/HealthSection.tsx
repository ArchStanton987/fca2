import React from "react"
import { ActivityIndicator, ScrollView } from "react-native"

import effectsMap from "lib/character/effects/effects"
import { observer } from "mobx-react-lite"

import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import colors from "styles/colors"

function HealthSection() {
  const { charId } = useCharacter()
  const { membersRecord } = useSquad()
  const { firstname = "", lastname = "" } = membersRecord[charId]
  const name = lastname.length > 0 ? `${firstname} ${lastname.toUpperCase()}` : firstname

  const { effects } = useCharacter()

  return (
    <ScrollView style={{ flexGrow: 0, width: 160 }}>
      <Section style={{ alignItems: "center", paddingHorizontal: 10 }}>
        <Txt>{name.toUpperCase()}</Txt>
        <Spacer y={15} />
        <HealthFigure />
        <Spacer y={15} />
      </Section>
      <Spacer y={5} />
      <Section>
        <Txt>EFFETS</Txt>
        <Spacer y={5} />
        {effects ? (
          <List
            data={effects}
            horizontal
            keyExtractor={item => item.dbKey || item.id}
            style={{ flexWrap: "wrap" }}
            separator={<Txt> / </Txt>}
            renderItem={({ item }) => <Txt>{effectsMap[item.id].label}</Txt>}
          />
        ) : (
          <ActivityIndicator color={colors.secColor} />
        )}
      </Section>
    </ScrollView>
  )
}

export default observer(HealthSection)
