
import './App.css';
import { Routes, Route } from 'react-router-dom'
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Nav from './components/nav/nav';
import { useDispatch, useSelector } from 'react-redux';
import Profil from './components/Account/Profil';
import Accueil from './components/Accueil/Accueil';




function App() {
  const { data: user } = useSelector((state) => state.user);
  





  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/signup" element={<Register />} />
        <Route path="/account/profile" element={user ? <Profil /> : <p>Veuillez vous connecter</p>} />
      </Routes>
    </div>
  );
}

export default App;
