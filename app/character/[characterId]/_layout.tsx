import { Slot } from "expo-router"

export default function CharLayout() {
  // return (
  //   <Drawer>
  //     <Drawer.Screen
  //       name="index"
  //       // options={{ title: "Character" }}
  //     />
  //     <Drawer.Screen name="inventory" options={{ title: "Inventaire" }} />
  //   </Drawer>
  // )
  return <Slot />
}
