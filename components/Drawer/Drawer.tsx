import { useRouter } from "expo-router/src/hooks"

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from "@react-navigation/drawer"

import SmallLine from "components/draws/Line/Line"

import styles from "./Drawer.styles"

type CustomDrawerProps = DrawerContentComponentProps & {
  charId: string
}

export default function CustomDrawer(props: CustomDrawerProps) {
  const router = useRouter()

  const toHome = () => router.push("/")

  return (
    <DrawerContentScrollView scrollEnabled={false} {...props}>
      <SmallLine top left />

      <DrawerItem label="<FCA>" labelStyle={styles.fca} onPress={toHome} />

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}
