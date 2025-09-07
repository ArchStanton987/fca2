import { PressableProps } from "react-native"

import { router } from "expo-router"

import { Ammo } from "lib/objects/data/ammo/ammo.types"

import DeleteInput from "components/DeleteInput"
import ListLabel from "components/ListLabel"
import ListScoreLabel from "components/ListScoreLabel"
import Selectable from "components/Selectable"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"

type AmmoRowProps = PressableProps & {
  ammo: Ammo
  isSelected: boolean
  onPress: () => void
}

export default function AmmoRow({ ammo, isSelected, onPress }: AmmoRowProps) {
  const { squadId } = useSquad()
  const { charId } = useCharacter()

  const onPressDel = () => {
    router.push({
      pathname: routes.modal.updateObjects,
      params: { squadId, charId, initCategory: "ammo" }
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
