import React, { useEffect } from "react";
import styles from "../../styles/Nav.module.css";
import { Link, useNavigate } from "react-router-dom";
import { logout, userCurrent } from "../../JS/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user?.data);
  const isAuth = !!userState;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userState) {
      dispatch(userCurrent());
    }
  }, [dispatch, userState]);

  const handleLogoutClick = async () => {
    try {
      await dispatch(logout());
      navigate("/account/login");
    } catch (error) {
      console.error("Une erreur s'est produite lors de la déconnexion :", error);
    }
  };

  return (
    <nav className={styles.mainNav}>
      <div>
        <div className={styles.container1}>
        <img className={styles.img} src={`${process.env.PUBLIC_URL}/memme.jpg`} alt="img" />
        </div>
      </div>
      <div>
        {isAuth ? (
          <div className={styles.rightSideNav}>
            <div className={styles.ww}>
              <h1>
                <Link className={styles.ww} to="/">Memes</Link>
              </h1>
            </div>
            <div>
              <div className={styles.container2}>
                <Link className={`d-block ${styles.linkBTN}`} to="/account/profile">Profile</Link>
                <span className={styles.or}></span>
                <button className={styles.linkBTN} onClick={handleLogoutClick}>Logout</button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.rightSideNav}>
            <div className={styles.ww}>
              <h1>
                <Link className={styles.ww} to="/">Memes</Link>
              </h1>
            </div>
            <div>
              <div className={styles.container2}>
                <Link className={`d-block ${styles.linkBTN}`} to="/account/login">Login</Link>
                <span className={styles.or}></span>
                <Link className={styles.linkBTN} to="/account/signup">Signup</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
