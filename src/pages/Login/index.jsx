import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getUserInfo } from "../../services/api";
import { subscribeToNotifications } from "../../notifications/notificationSwSubscriber";
import { configureFCM } from "../../firebase/firebaseConfig";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  function onChangeEmail(event) {
    setEmail(event.target.value);
  }

  function onChangePassword(event) {
    setPassword(event.target.value);
  }

  async function onLogin() {
    const auth = getAuth();
    const userCreadential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      return;
    });
    if (userCreadential) {
      setToken(userCreadential.user.accessToken);
      const { data: user } = await getUserInfo(userCreadential.user.uid);
      setUser(user);
      try {
        await configureFCM(userCreadential.user.uid);
        subscribeToNotifications(userCreadential.user.uid);
      } catch (err) {
        console.error(err);
      }
      navigate("/main");
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginInputContainer}>
        <h1>Sign in to PushNotify</h1>
        <input
          type="email"
          placeholder="email"
          onChange={onChangeEmail}
        ></input>
        <input
          type="password"
          placeholder="password"
          onChange={onChangePassword}
        ></input>
        <button onClick={onLogin}>Login</button>
        <span>Don't have an account yet?</span>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};
