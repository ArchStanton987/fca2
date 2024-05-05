import React from "react"
import { ScrollView } from "react-native"

import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import { MiscObject } from "lib/objects/data/misc-objects/misc-objects-types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"

function Header() {
  return (
    <>
      <Txt>DESCRIPTION</Txt>
      <Spacer y={10} />
    </>
  )
}

export default function MiscObjDetails({ miscObj }: { miscObj: MiscObject | null }) {
  if (!miscObj) return <Header />

  const { description, symptoms } = miscObj.data

  return (
    <>
      <Header />
      {miscObj ? (
        <ScrollView>
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
      ) : null}
    </>
  )
}
