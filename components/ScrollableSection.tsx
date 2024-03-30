import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import colors from "styles/colors"

import Spacer from "./Spacer"
import Txt from "./Txt"
import SmallLine from "./draws/Line/Line"

type ScrollableSectionProps = {
  title: string
  style?: StyleProp<ViewStyle>
  children: JSX.Element
}

const styles = StyleSheet.create({
  horizLine: {
    width: "100%",
    height: 1,
    backgroundColor: colors.secColor
  }
})

export default function ScrollableSection({ title, style, children }: ScrollableSectionProps) {
  return (
    <View style={style}>
      <SmallLine top left style={{ top: 16 }} />
      <SmallLine top right style={{ top: 16 }} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View style={[styles.horizLine, { position: "absolute" }]} />
        <View
          style={{
            padding: 8,
            backgroundColor: colors.primColor,
            alignItems: "center"
          }}
        >
          <Txt>{title}</Txt>
        </View>
      </View>
      <ScrollView style={{ paddingHorizontal: 10, flex: 1 }}>
        {children}
        <Spacer y={8} />
      </ScrollView>
      <SmallLine bottom right />
      <SmallLine bottom left />
      <View style={styles.horizLine} />
    </View>
  )
}
