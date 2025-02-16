export type DbEntity = Record<string, any>
export type BaseParams = Record<string, string>

type SubscriptionReturnType<T> = {
  subscribe: (callback: () => void) => () => void
  getSnapshot: () => T
}

export interface Repository<Db extends DbEntity, BP extends BaseParams> {
  get: (params: BP) => Db
  getChild: <K extends keyof Db>(params: BP & { childKey: K }) => Db[K]
  sub?: (params: BP) => Db | SubscriptionReturnType<Db>
  subChild?: <K extends keyof Db>(
    params: BP & { childKey: K }
  ) => Db[K] | SubscriptionReturnType<Db[K]>
  set: (params: BP, data: Db) => void
  setChild: <K extends keyof Db>(params: BP & { childKey: K }, data: Db[K]) => void
  setChildren: (params: BP, data: Partial<Db>) => void
  delete: (params: BP) => void
  deleteChild: <K extends keyof Db>(params: BP & { childKey: K }) => void
  deleteChildren: <K extends keyof Db>(params: BP, keys: K[]) => void
}
