import React, { useState } from "react";
import styles from "../../styles/Login.module.css"; // ✅ Correction ici
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../../JS/userSlice/userSlice";

const Login = () => {
  const [login, setlogin] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    if (!login.email || !login.password) {
        alert("Veuillez saisir à la fois l'email et le mot de passe");
        return;
    }
    try {
      await dispatch(userLogin(login));
      navigate("/account/profile");
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion :", error);
      alert("Email ou mot de passe incorrect !");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContainerv2}>
        <h1>Welcome back</h1>

        <div className={styles.inputContainer}>
          <label>EMAIL</label>
          <input
            onChange={(e) => setlogin({ ...login, email: e.target.value })}
            placeholder="enter your email"
            type="email"
          />
        </div>

        <div className={styles.inputContainer}>
          <label>PASSWORD</label>
          <input
            onChange={(e) => setlogin({ ...login, password: e.target.value })}
            placeholder="enter your password"
            type="password"
          />
        </div>

        <div className={styles.forgetmeContainer}>
          <div>
            <Link to="/account/forgotpassowrd">Forgot password?</Link>
          </div>
        </div>

        <button onClick={handleLoginClick} className={styles.loginBTN}>
          LOGIN
        </button>

        <span className={styles.notreg}>
          Not registered yet?{" "}
          <Link className={styles.singupBTN} to="/account/signup">
            Signup
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
