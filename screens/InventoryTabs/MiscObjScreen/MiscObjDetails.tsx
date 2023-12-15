import React from "react"

import { ScrollView } from "react-native-gesture-handler"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { MiscObject } from "models/objects/misc/misc-object-types"

export default function MiscObjDetails({ miscObj }: { miscObj?: MiscObject }) {
  if (!miscObj) return null

  return (
    <ScrollView>
      <Txt>DESCRIPTION</Txt>
      <Spacer y={10} />
      <Txt>{miscObj.description}</Txt>
    </ScrollView>
  )
}
