import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import Home from "./LoggedIn/Home";
import Login from "./Login";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  if (isLoggedIn) {
    return <Home />
  }
  else {
    return <Login />
  }
  
}
