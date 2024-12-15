import { StyleSheet, View, ViewProps } from "react-native"

const createStyles = () =>
  StyleSheet.create({
    drawerPage: {
      flex: 1,
      flexDirection: "row"
    }
  })

type DrawerPageProps = ViewProps

export default function DrawerPage({ children, style }: DrawerPageProps) {
  const styles = createStyles()
  return <View style={[styles.drawerPage, style]}>{children}</View>
}
