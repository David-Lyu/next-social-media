import { createContext } from 'react';

export const initialState = {
  token: null,
  user: {
    username: ''
  },
  searchedUser: null
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'token':
      return { ...state, token: action.payload };
    case 'logout':
      return initialState;
    case 'searchedUser': {
      return { ...state, searchedUser: action.payload };
    }
  }
};
export const StateContext = createContext();
export const DispatchContext = createContext();
