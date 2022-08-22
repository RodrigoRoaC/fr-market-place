import React, { useEffect, useState } from 'react'
import { UserContext } from './UserContext'

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userLocal = localStorage.getItem('cmd_user');
    if (userLocal) {
      setUser(JSON.parse(userLocal));
    }
  }, [setUser]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      { children }
    </UserContext.Provider>
  )
}

export default UserProvider;
