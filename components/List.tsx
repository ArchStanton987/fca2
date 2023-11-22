import { ComponentType, ReactElement } from "react"
import { StyleProp, View, ViewProps, ViewStyle } from "react-native"

type RenderItem<T> = {
  item: T
  index: number
}

type ListProps<T> = ViewProps & {
  data: T[]
  renderItem: (renderItem: RenderItem<T>) => ReactElement
  keyExtractor: (item: T) => string
  itemContainerStyle?: StyleProp<ViewStyle>
  horizontal?: boolean
  separator?: ReactElement
  ListHeaderComponent?: ComponentType
  ListFooterComponent?: ComponentType
  ListEmptyComponent?: ComponentType
}

export default function List<T>(props: ListProps<T>) {
  const {
    data,
    renderItem,
    keyExtractor,
    itemContainerStyle,
    horizontal = false,
    style,
    separator,
    ListFooterComponent,
    ListHeaderComponent,
    ListEmptyComponent
  } = props
  const hasHeader = !!ListHeaderComponent
  const hasSeparator = !!separator
  const hasFooter = !!ListFooterComponent
  const hasEmptyComponent = !!ListEmptyComponent
  return (
    <View style={[{ flexDirection: horizontal ? "row" : "column" }, style]}>
      {hasHeader && <ListHeaderComponent />}
      {hasEmptyComponent && data.length === 0 ? <ListEmptyComponent /> : null}
      {data.map((item, index) => {
        const element = renderItem({ item, index })
        const key = keyExtractor(item)
        const isLast = index === data.length - 1
        return (
          <View
            key={key}
            style={[{ flexDirection: horizontal ? "row" : "column" }, itemContainerStyle]}
          >
            {element}
            {hasSeparator && !isLast && separator}
          </View>
        )
      })}
      {hasFooter && <ListFooterComponent />}
    </View>
  )
}
