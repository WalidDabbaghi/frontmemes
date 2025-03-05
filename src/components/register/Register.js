import React, { useState } from 'react';
import styles from "../../styles/Signup.module.css"; // ✅ Correction ici
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userRegister } from '../../JS/userSlice/userSlice';

const Register = () => {
  const [register, setregister] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegisterClick = async () => {
    try {
      await dispatch(userRegister(register));
      navigate("/account/profile");
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion :", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div onSubmit={(e) => e.preventDefault()} className={styles.loginContainerv2}>
        <h1>Create your account</h1>

        <div className={styles.inputContainer}>
          <label>FIRST NAME</label>
          <input 
            onChange={(e) => setregister({ ...register, name: e.target.value })}
            name="firstName" placeholder="Enter your first name" type="text" 
          />
        </div>

        <div className={styles.inputContainer}>
          <label>LAST NAME</label>
          <input 
            onChange={(e) => setregister({ ...register, lastName: e.target.value })}
            name="lastName" placeholder="Enter your last name" type="text" 
          />
        </div>

        <div className={styles.inputContainer}>
          <label>EMAIL</label>
          <input 
            onChange={(e) => setregister({ ...register, email: e.target.value })}
            name="email" placeholder="Enter your email" type="email" 
          />
        </div>

        <div className={styles.inputContainer}>
          <label>PASSWORD</label>
          <input 
            onChange={(e) => setregister({ ...register, password: e.target.value })}
            name="password" placeholder="Enter your password" type="password" 
          />
        </div>

        <button
          onClick={handleRegisterClick} 
          className={styles.loginBTN} /* ✅ Correction ici */
        >
          REGISTER
        </button>
        
        <div className={styles.footerContainer}>
          <div>
            Already Signed Up? <Link to="/account/login">Login</Link>
          </div>
          <div>
            <Link to="/account/forgotpassword">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
