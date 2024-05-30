import { AntDesign } from "@expo/vector-icons"

import {
  ClothingSort,
  ClothingSortableKey
} from "screens/InventoryTabs/ClothingsScreen/ClothingsScreen.types"
import {
  WeaponSort,
  WeaponSortableKey
} from "screens/InventoryTabs/WeaponsScreen/WeaponsScreen.types"
import colors from "styles/colors"

type CaretProps = {
  type: WeaponSortableKey | ClothingSortableKey
  sortState: WeaponSort | ClothingSort
}

export default function Caret({ type, sortState }: CaretProps) {
  const isVisible = sortState.type === type
  return (
    <AntDesign
      name={sortState.isAsc ? "caretup" : "caretdown"}
      size={6}
      color={isVisible ? colors.secColor : "transparent"}
    />
  )
}
