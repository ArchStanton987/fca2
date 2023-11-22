import React, { ComponentType, ReactElement } from "react"
import { View, ViewProps } from "react-native"

type RenderItem<T> = {
  item: T
  index: number
}

type ListProps<T> = ViewProps & {
  data: T[]
  renderItem: (renderItem: RenderItem<T>) => ReactElement
  keyExtractor: (item: T) => string
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
          <React.Fragment key={key}>
            {element}
            {hasSeparator && !isLast && separator}
          </React.Fragment>
        )
      })}
      {hasFooter && <ListFooterComponent />}
    </View>
  )
}
