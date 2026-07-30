/**
 * Compile-time equality check between two types.
 * Used to bind Drizzle `$inferSelect` to a shared entity interface.
 */
export type AssertEqual<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
    ? (<G>() => G extends U ? 1 : 2) extends <G>() => G extends T ? 1 : 2
      ? true
      : false
    : false;

export type AssertTrue<T extends true> = T;

export type AssertSchema<TInfer, TEntity> =
  AssertEqual<TInfer, TEntity> extends true
    ? true
    : {
        error: 'Drizzle $inferSelect does not match shared entity interface';
        infer: TInfer;
        entity: TEntity;
      };

/** `assertSchemaMatch<AssertSchema<typeof table.$inferSelect, IEntity>>()` */
export function assertSchemaMatch<T extends true>(force?: T): void {
  void force;
}
