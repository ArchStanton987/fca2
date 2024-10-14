import React from "react"
import { ScrollView } from "react-native"

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

  const { description } = miscObj.data

  return (
    <>
      <Header />
      {miscObj ? (
        <ScrollView>
          <Txt>{description}</Txt>
          <Spacer y={10} />
        </ScrollView>
      ) : null}
    </>
  )
}
