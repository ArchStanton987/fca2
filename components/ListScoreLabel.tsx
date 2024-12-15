import { View } from "react-native"

import Txt from "./Txt"

type ListScoreLabelProps = {
  score: number | string
}

export default function ListScoreLabel({ score }: ListScoreLabelProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        width: 32
      }}
    >
      <Txt>{score}</Txt>
    </View>
  )
}
