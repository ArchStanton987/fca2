import React from "react"
import { ScrollView } from "react-native"

import MiscObject from "lib/objects/data/misc-objects/MiscObject"

import Spacer from "components/Spacer"
import Txt from "components/Txt"

export default function MiscObjDetails({ miscObj }: { miscObj: MiscObject | null }) {
  if (!miscObj) return null

  const { description } = miscObj.data

  return miscObj ? (
    <ScrollView>
      <Txt>{description}</Txt>
      <Spacer y={10} />
    </ScrollView>
  ) : null
}
