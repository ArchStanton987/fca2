import { Platform, StyleSheet, View, ViewProps } from "react-native"

const createStyles = () =>
  StyleSheet.create({
    tabPage: {
      flex: 1,
      flexDirection: "row",
      marginTop: Platform.OS === "web" ? 0 : 25
    }
  })

type DrawerPageProps = ViewProps

export default function TabPage({ children, style }: DrawerPageProps) {
  const styles = createStyles()
  return <View style={[styles.tabPage, style]}>{children}</View>
}
