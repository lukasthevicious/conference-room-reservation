import { useState, useContext } from "react";
import AuthContext from "../state/AuthContext";

import { useNavigate, useLocation } from "react-router-dom";
import { UserTypeInLS } from "../types/types";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { fetchUserData } from "../utils/fetchUserData";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState({ error: false, message: "" });

  const navigate = useNavigate();
  const location = useLocation();

  //Odkud se user prokliknul
  const from = location.state?.from?.pathname || "/datepick";

  const loginUser = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    let userData: UserTypeInLS | undefined = {} as UserTypeInLS | undefined;
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            userData = await fetchUserData(userCredential.user);
            console.log(userData);
          })
          .then(() => {
            if (!userData) return;
            setUser(userData);
            navigate(from, { replace: true });
            setIsLoading(false);
          });
      })

      .catch((error) => {
        setIsLoading(false);
        setLoginError({ error: true, message: error.message });
      });
  };

  return { loginUser, isLoading, loginError };
};

export default useLogin;
