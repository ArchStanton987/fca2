export type ClothingSortableKey =
  | "dbKey"
  | "equiped"
  | "name"
  | "physRes"
  | "lasRes"
  | "fireRes"
  | "plaRes"
  | "malus"
export type ClothingSort = { type: ClothingSortableKey; isAsc: boolean }
