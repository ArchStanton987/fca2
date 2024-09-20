// import { useMemo } from "react"
// import { View } from "react-native"

// import { Tabs } from "expo-router"

// import Header from "components/Header/Header"
// import TabBar from "components/TabBar/TabBar"
// import { AdminContext } from "contexts/AdminContext"
// import { useSquad } from "contexts/SquadContext"
// import useGetSquadCharacters from "hooks/db/useGetSquadCharacters"
// import LoadingScreen from "screens/LoadingScreen"
// import colors from "styles/colors"

// export default function AdminLayout() {
//   const { date, members } = useSquad()
//   // TODO: fix useGetSquadCharacters loop when dependencies are registered, insure stable ref of params
//   const squadMembersIds = useMemo(() => members.map(member => member.id), [members])
//   const jsonDate = date.toJSON()
//   const squadDate = useMemo(() => jsonDate, [jsonDate])
//   const characters = useGetSquadCharacters(squadMembersIds || [], squadDate)

//   const context = useMemo(() => {
//     if (!characters) return null
//     return { characters }
//   }, [characters])

//   if (!context) return <LoadingScreen />

//   return (
//     <AdminContext.Provider value={context}>
//       <View style={{ padding: 10, flex: 1 }}>
//         <Tabs
//           // eslint-disable-next-line react/no-unstable-nested-components
//           tabBar={props => <TabBar tabBarId="main" {...props} />}
//           screenOptions={{
//             tabBarHideOnKeyboard: true,
//             // eslint-disable-next-line react/no-unstable-nested-components
//             header: props => (
//               <Header headerElementsIds={["date", "time", "squadName", "home"]} {...props} />
//             ),
//             headerStyle: { backgroundColor: colors.primColor, borderBottomWidth: 0 }
//           }}
//           sceneContainerStyle={{ backgroundColor: colors.primColor }}
//         >
//           <Tabs.Screen name="datetime" options={{ title: "Horloge" }} />
//         </Tabs>
//       </View>
//     </AdminContext.Provider>
//   )
// }
