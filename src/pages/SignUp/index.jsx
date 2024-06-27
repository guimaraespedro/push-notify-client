import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import styles from "./signup.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createUserInfo } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    passwordMatch: false,
    loginFailed: false,
    message: "",
  });

  const { createSessionData } = useAuth();
  const navigate = useNavigate();

  async function onSignUp() {
    if (password !== confirmPassword) {
      setError({
        passwordMatch: true,
        loginFailed: false,
        message: "Password must match",
      });
      return Promise.resolve();
    }
    if (password.length < 6) {
      setError({
        passwordLength: true,
        passwordMatch: false,
        loginFailed: false,
        message: "Password must have 6 digits or more",
      });
      return Promise.resolve();
    }

    toast("Account successfully created!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    setError({
      passwordMatch: false,
      loginFailed: false,
      message: "",
    });
    const userCredential = await signUpUser();
    await createUser(userCredential);
    updateSessionData(userCredential);
    navigate("/login");
  }

  async function signUpUser() {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      setError({
        passwordMatch: false,
        loginFailed: true,
        message: error.message,
      });
    });
    return userCredential;
  }

  async function createUser(userCredential) {
    const id = userCredential.user.uid;
    await createUserInfo({
      id,
      email,
      name,
    }).catch((error) => {
      setError({
        passwordMatch: false,
        loginFailed: true,
        message: error.message,
      });
    });
  }

  function updateSessionData(userCredential) {
    const sessionData = {
      token: userCredential.accessToken,
      user: {
        id: userCredential.uid,
        email,
      },
    };
    createSessionData(sessionData);
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.inputContainer}>
        <h1>Create your account to PushNotify!</h1>
        {error.loginFailed ||
          error.passwordMatch ||
          (error.passwordLength && error.message && (
            <span className={styles.error}>{error.message}</span>
          ))}
        <input
          type="name"
          placeholder="name"
          onChange={(event) => setName(event.target.value)}
        ></input>
        <input
          type="email"
          placeholder="email"
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        <input
          type="password"
          placeholder="password"
          onChange={(event) => setPassword(event.target.value)}
        ></input>
        {error.passwordMatch && (
          <span className={styles.error}>Passwords must match.</span>
        )}
        <input
          type="password"
          placeholder="confirm password"
          onChange={(event) => setConfirmPassword(event.target.value)}
        ></input>
        <button onClick={onSignUp}>Sign Up</button>
        <span>Already have an account?</span>
        <Link to="/">Sign in</Link>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
