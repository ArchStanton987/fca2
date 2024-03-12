import { FlatList, View } from "react-native"

import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import clothingsMap from "lib/objects/clothings/clothings"
import { ClothingId } from "lib/objects/clothings/clothings.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { CharClothing } from "hooks/db/useGetEquipedObj"

function Header() {
  return (
    <>
      <Txt>DETAILS</Txt>
      <Spacer y={10} />
    </>
  )
}

const getClothingDetails = (id: ClothingId) => {
  const cloth = clothingsMap[id]
  return [
    { label: secAttrMap.armorClass.short, value: cloth.armorClass },
    { label: "SEUIL", value: cloth.threshold },
    { label: secAttrMap.maxPlace.short, value: cloth.place },
    { label: "POIDS", value: cloth.weight },
    { label: "EFFETS", value: cloth.symptoms.filter(el => el.id !== "armorClass") }
  ]
}

export default function ClothingDetails({ charClothing }: { charClothing?: CharClothing }) {
  const clothingDetails = charClothing ? getClothingDetails(charClothing.id) : []
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
