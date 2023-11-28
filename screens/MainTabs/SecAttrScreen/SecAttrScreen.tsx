import { FlatList } from "react-native"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import AttributeRow, { AttributeHeader } from "components/tables/Attributes/AttributeRow"
import secAttrMap from "models/character/sec-attr/sec-attr"
import { useBaseAttr } from "providers/BaseAttrProvider"
import { useCurrAttr } from "providers/CurrAttrProvider"
import LoadingScreen from "screens/LoadingScreen"

const secAttrArray = Object.values(secAttrMap)

export default function SecAttrScreen() {
  const baseContext = useBaseAttr()
  const currContext = useCurrAttr()

  if (!baseContext.isReady || !currContext.isReady) return <LoadingScreen />
  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={secAttrArray}
          keyExtractor={item => item.id}
          ListHeaderComponent={AttributeHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => {
            const { label } = secAttrMap[item.id]
            const baseValue = baseContext.baseSecAttr[item.id]
            const modValue = currContext.modSecAttr[item.id]
            const currValue = currContext.currSecAttr[item.id]
            return (
              <AttributeRow
                label={label}
                values={{ baseValue, modValue, currValue }}
                unit={item.unit}
              />
            )
          }}
        />
      </Section>
    </DrawerPage>
  )
}
