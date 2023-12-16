import React from "react"

import { ScrollView } from "react-native-gesture-handler"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { changeableAttributesMap } from "models/character/effects/changeable-attr"
import { MiscObject } from "models/objects/misc/misc-object-types"

export default function MiscObjDetails({ miscObj }: { miscObj?: MiscObject }) {
  if (!miscObj) return null

  const { description, symptoms } = miscObj

  return (
    <ScrollView>
      <Txt>DESCRIPTION</Txt>
      <Spacer y={10} />
      <Txt>{description}</Txt>
      <Spacer y={10} />
      {symptoms.length > 0
        ? symptoms.map(symptom => {
            const { id, value } = symptom
            const prepend = value > 0 ? "+" : ""
            return (
              <Txt key={id}>
                {changeableAttributesMap[id].short}: {prepend}
                {value}
              </Txt>
            )
          })
        : null}
    </ScrollView>
  )
}
