import { PressableProps } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useBarterActions } from "lib/objects/barter-store"
import { Ammo } from "lib/objects/data/ammo/ammo.types"

import DeleteInput from "components/DeleteInput"
import ListLabel from "components/ListLabel"
import ListScoreLabel from "components/ListScoreLabel"
import Selectable from "components/Selectable"
import routes from "constants/routes"

type AmmoRowProps = PressableProps & {
  ammo: Ammo
  isSelected: boolean
  onPress: () => void
}

export default function AmmoRow({ ammo, isSelected, onPress }: AmmoRowProps) {
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
      <ListLabel label={ammo.data.label} />
      <ListScoreLabel score={ammo.amount} />
      <DeleteInput isSelected={isSelected} onPress={onPressDel} style={{ width: 50 }} />
    </Selectable>
  )
}
