import React from "react"

import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { ScrollView } from "react-native-gesture-handler"

import Spacer from "components/Spacer"
import Txt from "components/Txt"

export default function ConsumableDetails({
  charConsumable
}: {
  charConsumable: Consumable | null
}) {
  if (!charConsumable) return null

  const { description, maxUsage } = charConsumable.data

  return (
    <ScrollView>
      <Txt>DESCRIPTION</Txt>
      <Spacer y={10} />
      <Txt>{description}</Txt>
      <Spacer y={20} />
      {maxUsage && charConsumable.remainingUse ? (
        <Txt>
          Utilisations : {charConsumable?.remainingUse}/{maxUsage}
        </Txt>
      ) : null}
    </ScrollView>
  )
}
