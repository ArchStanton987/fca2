import { TouchableOpacityProps } from "react-native"

import ListItemSelectable from "components/ListItemSelectable"
import Txt from "components/Txt"

import styles from "./UpdateObjects.styles"

type ListItemRowProps = TouchableOpacityProps & {
  label: string
  inv: string | number
  mod: string | number
  prev: string | number
  isSelected?: boolean
}

export default function ListItemRow({
  label,
  inv,
  mod,
  prev,
  isSelected,
  ...rest
}: ListItemRowProps) {
  return (
    <ListItemSelectable
      style={[styles.listItemContainer, isSelected && styles.listItemContainerSelected]}
      {...rest}
    >
      <Txt style={[styles.listItem, styles.listItemLabel]} numberOfLines={1}>
        {label}
      </Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{inv}</Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{mod}</Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{prev}</Txt>
    </ListItemSelectable>
  )
}
