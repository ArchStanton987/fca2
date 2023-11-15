import React, { ReactElement, ReactNode } from "react"

interface WithItemSeparatorProps {
  children: ReactNode
  ItemSeparatorComponent: ReactElement
}

export default function WithItemSeparator({
  children,
  ItemSeparatorComponent
}: WithItemSeparatorProps) {
  const childrenArray = React.Children.toArray(children)

  const childrenWithSeparators = childrenArray.reduce<ReactNode[]>((acc, child, index) => {
    acc.push(child)
    if (index < childrenArray.length - 1) {
      const separatorKey = `separator-${index}`
      acc.push(
        React.cloneElement(ItemSeparatorComponent as React.ReactElement, { key: separatorKey })
      )
    }
    return acc
  }, [])

  return childrenWithSeparators
}
