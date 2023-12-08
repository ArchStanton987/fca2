import React from "react"
import { ActivityIndicator, ScrollView } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import useGetEffects from "hooks/db/useGetEffects"
import useGetSquad from "hooks/db/useGetSquad"
import effectsMap from "models/character/effects/effects"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

export default function HealthSection() {
  const { charId, squadId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const squad = useGetSquad(squadId)
  const firstname = squad?.members[charId].firstname || ""
  const lastname = squad?.members[charId].lastname || ""
  const name = lastname.length > 0 ? `${firstname} ${lastname.toUpperCase()}` : firstname
  const effects = useGetEffects(charId)
  return (
    <ScrollView>
      <Section style={{ width: 160 }}>
        <Txt>{name}</Txt>
        <Spacer y={5} />
        <HealthFigure />
      </Section>
      <Spacer y={5} />
      <Section style={{ width: 160 }}>
        <Txt>EFFETS</Txt>
        <Spacer y={5} />
        {effects ? (
          <List
            data={effects}
            horizontal
            keyExtractor={item => item.id}
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