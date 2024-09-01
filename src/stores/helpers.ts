import { getActivePinia, type Pinia, type Store } from 'pinia'
import cloneDeep from 'lodash.clonedeep'

interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>
}

export const resetPinia = () => {
  const p = getActivePinia() as ExtendedPinia
  if (p) p._s.forEach((store) => store.$reset())
}

export default function resetStore({ store }: { store: Store }) {
  const initialState = cloneDeep(store.$state)
  store.$reset = () => store.$patch(cloneDeep(initialState))
}
