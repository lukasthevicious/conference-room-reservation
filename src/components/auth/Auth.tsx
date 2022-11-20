import React, { useState, useContext } from "react";
/* import Input from "../layout/Input"; */
import { Button } from "@chakra-ui/react";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../state/AuthContext";
import { Input } from "@chakra-ui/react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { user, setUser } = authContext;

  const loginHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    //Firebase docs -  https://firebase.google.com/docs/auth/web/password-auth
    //Firebase Auth
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password).then(
          (userCredential) => {
            // Signed in
            const user = userCredential.user;
            setUser(user);

            navigate("/home");
            // ...
          }
        );
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <section className="flex justify-center items-center bg-gradient-to-r from-violet-300 to-violet-400 h-screen">
      <div className=" flex flex-col justify-center mb-24 items-center w-96 bg-white h-96 rounded-lg relative">
        <div
          style={{ borderRadius: "8px 8px 50% 50%" }}
          className="h-20 w-full bg-teal-600 absolute top-0 flex flex-col items-center justify-center"
        >
          <h1 className="text-2xl font-bold text-gray-50">Login</h1>
          <h3 className=" text-sm text-gray-50">Enter your credentials</h3>
        </div>

        <form className="w-80 mt-12 [&>input]:mt-2" onSubmit={loginHandler}>
          <Input
            id="email"
            name="email"
            type="e-mail"
            placeholder="Enter your e-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-center flex-col [&>button]:mt-1 mt-8">
            <Button colorScheme="teal" type="submit">
              Submit
            </Button>
            <Button colorScheme="teal" variant="outline">
              Back
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Auth;
