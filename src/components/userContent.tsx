import { createContext, useReducer, useContext, ReactNode } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

type State = {
  users: User[];
  searchQuery: string;
};

type Action =
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_USER"; payload: User | null };

const userReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

const initialState = {
  users: [],
  searchQuery: "",
  selectedUser: null,
};


const UserContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
