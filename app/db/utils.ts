/** 指定キーを non-null にした型。relational query の nullable relation 除去に使う */
export type WithRequired<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
