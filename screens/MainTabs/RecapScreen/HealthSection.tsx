import React from "react"
import { ActivityIndicator, View } from "react-native"

import effectsMap from "lib/character/effects/effects"
import { observer } from "mobx-react-lite"

import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

function HealthSection() {
  const { effects } = useCharacter()

  return (
    <View style={{ width: 160 }}>
      <Section title="santé">
        <Spacer y={5} />
        <HealthFigure />
        <Spacer y={5} />
      </Section>

      <Spacer y={10} />

      <ScrollSection title="effets en cours" style={{ flex: 1 }}>
        {effects ? (
          <List
            data={effects}
            horizontal
            keyExtractor={item => item.dbKey || item.id}
            style={{ flexWrap: "wrap", flex: 1 }}
            separator={<Txt> / </Txt>}
            renderItem={({ item }) => <Txt>{effectsMap[item.id].label}</Txt>}
          />
        ) : (
          <ActivityIndicator color={colors.secColor} />
        )}
      </ScrollSection>
    </View>
  )
}

export default observer(HealthSection)
