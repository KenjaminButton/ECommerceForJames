import { Session } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthData = {
  session: Session | null
  mounting: boolean
  user: any
}

const AuthContext = createContext<AuthData>({
  session: null,
  mounting: true,
  user: null
})

export default function AuthProvider({children}: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState(null)
  const [mounting, setMounting] = useState(true)



  useEffect( () => {
    const fetchSession = async () => {
      const {
        data: {session},
      } = await supabase.auth.getSession()

      setSession(session)


      if (session) {
        const { data: user, error} = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
        
        if (error) {
          console.error('error:::', error)
        } else {
          setUser(user)
        }
      }

      

      /*
        Setting mounting to false is essential for controlling the lifecycle of our
        component's rendering process; it ensures that we don't attempt to render
        dependent components until the necessary data (user session) has been fully loaded,
        which can improve user experience and avoid potential errors or unexpected UI behavior.
      */
      setMounting(false)
    }
    fetchSession()
    supabase.auth.onAuthStateChange( (_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    // Values coming in from state above
    <AuthContext.Provider value={{session, mounting, user}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ( ) => useContext(AuthContext)