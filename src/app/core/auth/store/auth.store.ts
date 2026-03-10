import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { UserInterface } from '../models/user.interface';

interface AuthState {
  currentUser: UserInterface | null;
  isSignedIn: boolean | null;
}

const initialState: AuthState = {
  currentUser: null,
  isSignedIn: null,
};

export const authStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(state => ({
    isAuthenticated: () => !!state.currentUser(),
  })),
  withMethods(store => {
    return {
      signIn(user: UserInterface) {
        patchState(store, { isSignedIn: true, currentUser: user });
      },
      signout() {
        patchState(store, { isSignedIn: false, currentUser: null });
      },
    };
  })
);
