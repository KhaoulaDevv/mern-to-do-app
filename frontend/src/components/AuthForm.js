import React, { useState } from "react";
import api from "../axiosConfig";
const AuthForm = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, { email, password });
      if (isLogin) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      } else {
        alert("Inscription réussie, connectez-vous !");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur");
    }
  };
  return (
    <div className="auth-form">
      <h2>{isLogin ? "Connexion" : "Inscription"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <button type="submit">{isLogin ? "Se connecter" : "S’inscrire"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Pas de compte ? Inscrivez-vous"
          : "Déjà un compte ? Connectez-vous"}
      </button>
    </div>
  );
};
export default AuthForm;
