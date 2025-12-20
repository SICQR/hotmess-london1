/**
 * Utility Type Definitions
 * Reusable utility types for the application
 */

/**
 * Make all fields of T non-nullable
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Make specific keys K of T optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific keys K of T required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Extract keys of T where the value type is assignable to U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Make all properties of T deeply readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Make all properties of T deeply partial
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Primitive types
 */
export type Primitive = string | number | boolean | null | undefined;

/**
 * JSON-serializable value
 */
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

/**
 * Async function type
 */
export type AsyncFunction<TArgs extends unknown[] = unknown[], TReturn = unknown> = 
  (...args: TArgs) => Promise<TReturn>;

/**
 * Function that can be sync or async
 */
export type MaybeAsync<T> = T | Promise<T>;

/**
 * Exact type - prevents excess properties
 */
export type Exact<T> = T & { [K in Exclude<keyof T, keyof T>]?: never };
