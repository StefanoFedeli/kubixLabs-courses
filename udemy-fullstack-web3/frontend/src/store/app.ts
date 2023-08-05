// Utilities
import {defineStore} from 'pinia'

export interface AppState {
  user: User | null;
  token: string | null;
}

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
}

function saveStore(state: AppState) {
  localStorage.setItem('store', JSON.stringify(state));
  console.log('State Saved');
}

function loadStore(): AppState {
  const store = localStorage.getItem('store');
  if (store) {
    console.log('State Loaded', JSON.parse(store));
    return JSON.parse(store);
  } else {
    return {
      user: null,
      token: null,
    };
  }
}

export const useAppStore = defineStore('app', {
  state: (): AppState => (loadStore()),
  getters: {
    isLoggedIn: (state: AppState) => !!state.token,
    isAdmin: (state: AppState) => state.user?.role === 'admin',
    isRegularUser: (state: AppState) => state.user?.role === 'regular',
  },
  actions: {
    login({user, token}) {
      this.user = user;
      this.token = token;
      saveStore({
        user: this.user,
        token: this.token,
      });
      console.log(this);
    },
    logout() {
      this.user = null;
      this.token = null;
      saveStore(this.$state);
    },
  }
})
