import { AccumulationFn } from '@rx-angular/state/lib/cdk';

/**
 * @description
 *
 *  only works, when only configured keys are passed through.
 *
 * ```ts
 *  set({ updating: [id]: true }) // possible;
 *  set({ updating: [id]: true, movies: [] }) // corrupt state;
 * ```
 * @param keys
 */
export function createSimpleDeepMergeAccumulator<T>(keys: (keyof T)[]) {
  return ((state: T, update: Partial<T>) => {
    // look for configured keys having a value
    const theKeysArray = keys.filter((i) => update[i] != null);
    if (theKeysArray.length) {
      // we need to perform deepMerge
      const newUpdate = theKeysArray.reduce(
        (acc, i) => ({ ...acc, [i]: { ...state[i], ...update[i] } }),
        {}
      );
      return { ...state, ...newUpdate };
    }
    // return default accumulator
    return { ...state, ...update };
  }) as AccumulationFn;
}

export function createDeepMergeAccumulator<T>(keys: (keyof T)[]) {
  return ((state: T, update: Partial<T>) => {
    // look for configured keys having a value
    const customKeys = keys.filter((i) => update[i] != null);
    // we need to perform deepMerge
    const hasCustomAccumulators = customKeys.length > 0;

    if (hasCustomAccumulators) {
      const keysSet = new Set(customKeys);
      const patchedUpdate = Object.keys(update).reduce((result, key) => {
        const updateKey = key as keyof T;

        if (keysSet.has(updateKey)) {
          // perform deepMerge
          const currentValue = state[updateKey];
          const patch = update[updateKey];
          return { ...result, [updateKey]: { ...currentValue, ...patch } };
        }
        // perform regular accumulation
        return { ...result, [updateKey]: update[updateKey] };
      }, {} as Partial<T>);
      // return updated state
      return { ...state, ...patchedUpdate };
    }
    // return default accumulator
    return { ...state, ...update };
  }) as AccumulationFn;
}
