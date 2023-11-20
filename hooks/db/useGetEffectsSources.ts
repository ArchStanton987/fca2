import useGetEffects from "hooks/db/useGetEffects"
import useGetEquipedObj from "hooks/db/useGetEquipedObj"

export default function useGetEffectsSources(charId: string) {
  const effects = useGetEffects(charId)
  const equipedObj = useGetEquipedObj(charId)
  return { effects, equipedObj }
}
