import React, { useState } from "react"
import { FlatList, ScrollView } from "react-native"

import specialMap, { specialArray } from "lib/character/abilities/special/special"
import { SpecialId } from "lib/character/abilities/special/special.types"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import AttributeRow, { AttributeHeader } from "components/tables/Attributes/AttributeRow"
import { useBaseAttr } from "providers/BaseAttrProvider"
import { useCurrAttr } from "providers/CurrAttrProvider"
import LoadingScreen from "screens/LoadingScreen"

export default function SpecialScreen() {
  const [selectedId, setSelectedId] = useState<SpecialId | null>(null)

  const baseContext = useBaseAttr()
  const currContext = useCurrAttr()

  if (!baseContext.isReady || !currContext.isReady) return <LoadingScreen />

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={specialArray}
          keyExtractor={item => item.id}
          ListHeaderComponent={AttributeHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => {
            const { label } = specialMap[item.id]
            const baseValue = baseContext.baseSpecial[item.id]
            const modValue = currContext.modSpecial[item.id]
            const currValue = currContext.currSpecial[item.id]
            return (
              <AttributeRow
                label={label}
                values={{ baseValue, modValue, currValue }}
                isSelected={selectedId === item.id}
                onPress={() => setSelectedId(item.id)}
              />
            )
          }}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 200 }}>
        <ScrollView>
          <Txt>DESCRIPTION</Txt>
          <Spacer y={10} />
          {selectedId && <Txt>{specialMap[selectedId].description}</Txt>}
        </ScrollView>
      </Section>
    </DrawerPage>
  )
}
