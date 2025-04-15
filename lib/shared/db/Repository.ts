export type DbEntity = Record<string, any>
export type BaseParams = Record<string, string | number>

type Sub<T> = {
  subscribe: (callback: () => void) => () => void
  getSnapshot: () => T
}

type Collectible = { id: string }
type Child<T> = { childKey: T }
type CollectibleChild<T> = Collectible & Child<T>

export interface Repository<Db extends DbEntity, BP extends BaseParams> {
  get: (params: BP & Collectible) => Db
  sub: (params: BP & Collectible) => Db | Sub<Db>
  set: (params: BP & Collectible, data: Db) => void
  patch: (params: BP & Collectible, data: Partial<Db>) => void
  delete: (params: BP & Collectible) => void

  add: (params: BP & { id?: string }, data: Db) => void

  getAll: (params: BP) => Record<string, Db>
  subAll: (params: BP) => Record<string, Db> | Sub<Record<string, Db>>
  setAll: (params: BP, data: Record<string, Db>) => void
  // patchAll: (params: BP, data: Record<string, Partial<Db>>) => void
  deleteAll: (params: BP) => void

  getChild: <K extends keyof Db>(params: BP & CollectibleChild<K>) => Db[K]
  subChild: <K extends keyof Db>(params: BP & CollectibleChild<K>) => Db[K] | Sub<Db[K]>
  setChild: <K extends keyof Db>(params: BP & CollectibleChild<K>, data: Db[K]) => void
  patchChild: <K extends keyof Db>(params: BP & CollectibleChild<K>, data: Partial<Db[K]>) => void
  deleteChild: <K extends keyof Db>(params: BP & CollectibleChild<K>) => void

  addChild: <K extends keyof Db>(
    params: BP & CollectibleChild<K> & { childId?: string },
    data: Db[K]
  ) => void

  // setChildren: <K extends keyof Db>(params: BP & CollectibleChild<K>, data: Db[K][]) => void
  // deleteChildren: <K extends keyof Db>(
  //   params: BP & CollectibleChild<K>,
  //   keys: (keyof Db[K])[]
  // ) => void
  // patchChildren: <K extends keyof Db>(
  //   params: BP & CollectibleChild<K>,
  //   data: Partial<Db[K]>[]
  // ) => void
  // addChildren: <K extends keyof Db>(
  //   params: BP & CollectibleChild<K>,
  //   data: (Db[K] & { id?: string })[]
  // ) => void
}
