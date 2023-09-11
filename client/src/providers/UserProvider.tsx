import { ReactNode, createContext, useState, useEffect } from "react";
import { api, setSessionId } from "../utils/api";
import { useNavigate } from "react-router-dom";

export interface User {
  username?: string;
  imageUrl?: string;
}

interface IUserContext {
  user?: User;
  setUser: (user: User) => void;
  logOut: VoidFunction
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const localUser = localStorage.getItem("user");
  const localSession = localStorage.getItem('session')
  let localUserObj = undefined
  if (localUser && localSession) {
    localUserObj = JSON.parse(localUser);
    setSessionId(localSession);
  }
  const [user, setUser] = useState<User | undefined>(localUserObj);

  function setUserWrapper(newUser: User) {
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  function logOut() {
    localStorage.removeItem('user')
    localStorage.removeItem('session')
    setSessionId('')
    setUser(undefined)
    navigate('/')
  }


  // check if authenticated, if not remove the user from localstorage and sign out
  async function checkAuth() {
    if (user) {
      const res = await api.get('/auth/check')
      if (res.status !== 200) {
        logOut()
      }
    }
  }
  useEffect(() => {
    checkAuth()
  }, [])


  return (
    <UserContext.Provider value={{ user, setUser: setUserWrapper, logOut }}>
      {children}
    </UserContext.Provider>
  );
}
