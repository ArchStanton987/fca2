// export function useSubPlayablesProgress(ids: string[]) {
//   const queryClient = useQueryClient()
//   const exp = usePlayablesExp(ids)
//   const charInfo = usePlayablesCharInfo(ids)
//   const abilities = usePlayablesAbilities(ids)

//   useEffect(() => {
//     ids.forEach((id, i) => {
//       queryClient.setQueryData(
//         ["v3", "playables", id, "progress"],
//         new Progress(exp[id], abilities[i].data, charInfo[i].data)
//       )
//     })
//   }, [queryClient, exp, ids, charInfo, abilities])
// }

// export function usePlayablesProgress(ids: string[]) {
//   return useSuspenseQueries({ queries: ids.map(id => getExpOptions(id)) })
// }

// export function useProgress(id: string) {
//   const abilities = useSuspenseQuery({
//     ...getExpOptions(id),
//     select:
//   })
// }
