import React from "react"
import { View } from "react-native"

import useCases from "lib/common/use-cases"

import CheckBox from "components/CheckBox/CheckBox"
import DrawerPage from "components/DrawerPage"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

export default function CombatScreen() {
  const character = useCharacter()
  const { status, secAttr } = character
  const { currAp } = status
  const maxAp = secAttr.curr.actionPoints

  const handleSetAp = async (i: number) => {
    const newValue = i < currAp ? i : i + 1
    await useCases.status.updateElement(character, "currAp", newValue)
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    apArr.push(`pa${i}`)
  }

  return (
    <DrawerPage>
      <Txt>Points d&apos;action</Txt>
      <Spacer y={20} />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center"
        }}
      >
        {apArr.map((ap, i) => (
          <CheckBox key={ap} isChecked={i < currAp} onPress={() => handleSetAp(i)} />
        ))}
      </View>
    </DrawerPage>
  )
}
