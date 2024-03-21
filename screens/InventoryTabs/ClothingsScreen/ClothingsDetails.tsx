import { FlatList, View } from "react-native"

import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import { Clothing } from "lib/objects/clothings/clothings.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"

function Header() {
  return (
    <>
      <Txt>DETAILS</Txt>
      <Spacer y={10} />
    </>
  )
}

const getClothingDetails = ({ data }: Clothing) => [
  { label: secAttrMap.armorClass.short, value: data.armorClass },
  { label: "SEUIL", value: data.threshold },
  { label: secAttrMap.maxPlace.short, value: data.place },
  { label: "POIDS", value: data.weight },
  { label: "EFFETS", value: data.symptoms.filter(el => el.id !== "armorClass") }
]

export default function ClothingDetails({ charClothing }: { charClothing: Clothing | null }) {
  const clothingDetails = charClothing ? getClothingDetails(charClothing) : []
  return (
    <FlatList
      data={clothingDetails}
      keyExtractor={item => item.label}
      ListHeaderComponent={Header}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => {
        if (Array.isArray(item.value)) {
          return (
            <View>
              <Spacer y={10} />
              {item.value.map(el => (
                <Txt key={el.id}>
                  {changeableAttributesMap[el.id].short}: {el.value}
                </Txt>
              ))}
            </View>
          )
        }
        return (
          <Txt>
            {item.label}: {item.value}
          </Txt>
        )
      }}
    />
  )
}
