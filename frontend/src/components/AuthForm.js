import React, { useState } from "react";
import api from "../axiosConfig";

const AuthForm = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, { email, password });

      if (isLogin) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      } else {
        // Clear fields and switch to login view
        setEmail("");
        setPassword("");
        setIsLogin(true);
        alert("Inscription réussie, connectez-vous !");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Une erreur est survenue";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Connexion" : "Inscription"}</h2>

      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading
            ? isLogin
              ? "Connexion..."
              : "Création du compte..."
            : isLogin
            ? "Se connecter"
            : "S'inscrire"}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)} className="btn-text">
        {isLogin
          ? "Pas de compte ? Inscrivez-vous"
          : "Déjà un compte ? Connectez-vous"}
      </button>
    </div>
  );
};

export default AuthForm;
