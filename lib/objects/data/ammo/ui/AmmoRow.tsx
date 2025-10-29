import { PressableProps } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useBarterActions } from "lib/objects/barter-store"

import DeleteInput from "components/DeleteInput"
import ListLabel from "components/ListLabel"
import ListScoreLabel from "components/ListScoreLabel"
import Selectable from "components/Selectable"
import routes from "constants/routes"

import ammoMap from "../ammo"
import { AmmoType } from "../ammo.types"

type AmmoRowProps = PressableProps & {
  ammoType: AmmoType
  count: number
  isSelected: boolean
  onPress: () => void
}

export default function AmmoRow({ ammoType, count, isSelected, onPress }: AmmoRowProps) {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()

  const barterActions = useBarterActions()

  const onPressDel = () => {
    barterActions.selectCategory("ammo")
    router.push({
      pathname: routes.modal.barter,
      params: { squadId, charId }
    })
  }

  return (
    <Selectable isSelected={isSelected} onPress={onPress}>
      <ListLabel label={ammoMap[ammoType].label} />
      <ListScoreLabel score={count} />
      <DeleteInput isSelected={isSelected} onPress={onPressDel} style={{ width: 50 }} />
    </Selectable>
  )
}
