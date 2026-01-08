import React from "react"
import { View } from "react-native"

import { useCharEffects } from "lib/character/effects/effects-provider"

import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"

import { useHealth } from "../health-provider"

export default function HealthSection({ charId }: { charId: string }) {
  const { data: effects } = useCharEffects(charId)
  const { data: health } = useHealth(charId)

  return (
    <View style={{ width: 160 }}>
      <Section title="santé">
        <Spacer y={5} />
        <HealthFigure charId={charId} />
        <Spacer y={5} />
      </Section>

      <Spacer y={10} />

      <ScrollSection title="effets en cours" style={{ flex: 1 }}>
        <List
          data={Object.values({ ...effects, ...health.calculatedEffects })}
          horizontal
          keyExtractor={item => item.dbKey || item.id}
          style={{ flexWrap: "wrap", flex: 1 }}
          separator={<Txt> / </Txt>}
          renderItem={({ item }) => <Txt>{item.data.label}</Txt>}
        />
      </ScrollSection>
    </View>
  )
}
