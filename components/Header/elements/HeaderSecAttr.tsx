import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import { SecAttrId } from "lib/character/abilities/sec-attr/sec-attr-types"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

export type HeaderSecAttrProps<T extends SecAttrId> = {
  secAttrId: T
}

export default function HeaderSecAttr<T extends SecAttrId>({ secAttrId }: HeaderSecAttrProps<T>) {
  const character = useCharacter()
  const label = secAttrMap[secAttrId].short
  const value = character.secAttr.curr[secAttrId]

  return (
    <HeaderElement>
      <Txt style={{ fontSize: 12 }}>{label}:</Txt>
      <Txt style={{ fontSize: 12 }}>{value}</Txt>
    </HeaderElement>
  )
}
