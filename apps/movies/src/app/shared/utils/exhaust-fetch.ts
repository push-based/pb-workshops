import {
  catchError,
  endWith,
  exhaustMap,
  Observable,
  of,
  startWith,
} from 'rxjs';

export interface FetchState {
  loading: boolean;
  error: any;
}

export function exhaustFetch<T>(
  trigger$: Observable<any>,
  data$: Observable<Partial<T>>
): Observable<Partial<T | FetchState>> {
  return trigger$.pipe(
    startWith(null),
    exhaustMap(() => {
      return data$.pipe(
        catchError((e) => of({ error: e })),
        startWith({ loading: true, error: null }),
        endWith({ loading: false })
      );
    })
  );
}
