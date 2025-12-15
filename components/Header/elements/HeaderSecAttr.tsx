import { useSecAttr } from "lib/character/abilities/abilities-provider"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import { SecAttrId } from "lib/character/abilities/sec-attr/sec-attr-types"
import { useCurrCharId } from "lib/character/character-store"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"

export type HeaderSecAttrProps<T extends SecAttrId> = {
  secAttrId: T
}

export default function HeaderSecAttr<T extends SecAttrId>({ secAttrId }: HeaderSecAttrProps<T>) {
  const charId = useCurrCharId()
  const { data: secAttr } = useSecAttr(charId)
  const label = secAttrMap[secAttrId].short
  const value = secAttr.curr[secAttrId]

  return (
    <HeaderElement>
      <Txt style={{ fontSize: 12 }}>{label}:</Txt>
      <Txt style={{ fontSize: 12 }}>{value}</Txt>
    </HeaderElement>
  )
}
