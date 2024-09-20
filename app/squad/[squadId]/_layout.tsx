// import { useMemo } from "react"

// import { Slot, useLocalSearchParams } from "expo-router"

// import Squad from "lib/character/Squad"
// import useCases from "lib/common/use-cases"

// import { DrawerParams } from "components/Drawer/Drawer.params"
// import { SquadContext } from "contexts/SquadContext"
// import useRtdbSub from "hooks/db/useRtdbSub"
// import LoadingScreen from "screens/LoadingScreen"
// import { SearchParams } from "screens/ScreenParams"

// export default function SquadLayout() {
//   const { squadId } = useLocalSearchParams() as SearchParams<DrawerParams>
//   const dbSquad = useRtdbSub(useCases.squad.get(squadId))

//   const squad = useMemo(() => {
//     if (!dbSquad) return null
//     return new Squad(dbSquad, squadId)
//   }, [dbSquad, squadId])

//   if (!squad) return <LoadingScreen />

//   return (
//     <SquadContext.Provider value={squad}>
//       <Slot />
//     </SquadContext.Provider>
//   )
// }
