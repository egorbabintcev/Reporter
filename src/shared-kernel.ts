export type UniqueId = string;

export type UnixTimestamp = number;

export type HTMLString = string;

export type TimeString = string;
export type DateString = string;
export type ISODateTimeString = string;

export type JWTString = string;

export type Entries<T> = Array<{
  [k in keyof T]: [k, T[k]]
}[keyof T]>;

export type AtLeastOne<T, U = {
  [K in keyof T]: Pick<T, K>
}> = Partial<T> & U[keyof U];

export type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T];

export type RecursiveKeyOf<TObj> = {
  [TKey in keyof TObj & (string | number)]:
  TObj[TKey] extends never[] ? `${TKey}` :
    TObj[TKey] extends object
      ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
      : `${TKey}`;
}[keyof TObj & (string | number)];
