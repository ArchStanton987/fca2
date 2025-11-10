import { StyleSheet, TouchableOpacity } from "react-native"

import { useItem } from "lib/inventory/use-sub-inv-cat"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

const styles = StyleSheet.create({
  actionButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: colors.secColor,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
})

export default function ConsumableDetails({
  dbKey,
  charId
}: {
  charId: string
  dbKey: string | null
}) {
  const useCases = useGetUseCases()

  const { data: consumable } = useItem(charId, dbKey ?? "")

  if (!consumable) return null
  if (consumable.category !== "consumables") throw new Error("Item is not a consumable")

  const { data, remainingUse } = consumable
  const { description, maxUsage } = data

  return dbKey ? (
    <>
      <Txt>{description}</Txt>
      <Spacer y={20} />
      {maxUsage && remainingUse ? (
        <Txt>
          Utilisations : {remainingUse}/{maxUsage}
        </Txt>
      ) : null}
      <Spacer y={20} />
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => useCases.inventory.consume({ charId, consumable })}
      >
        <Txt>CONSOMMER</Txt>
      </TouchableOpacity>
      <Spacer y={20} />
    </>
  ) : null
}
