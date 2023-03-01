import '@/styles/globals.css'
import { useEffect } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from '../../firebase';
import Login  from './login'
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from 'components/Loading';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)

  useEffect(()=>{
    if(user)
    {

      const document = doc(db, `users/${user.uid}`);
      setDoc(document,
        {
          email: user.email,
          lastActive: Timestamp.now(),
          photoURL: user.photoURL,
          name: user.displayName
        },
        {merge: true}
        )
      }
      console.log(user)
  }, [user])

  if(loading) return <Loading />
  if(!user) return <Login/>

  return <Component {...pageProps} />
}
