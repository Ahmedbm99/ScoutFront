import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../../services/AuthenticationService";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    if (!username || !password) {
      setErrorMsg("Veuillez remplir tous les champs.");
      return;
    }
    let credientials = { username, password };
    await AuthenticationService.login(credientials);
    setErrorMsg("");
    navigate("/home");
  } catch (err) {
    console.error("Login error:", err);
    setErrorMsg("Email ou mot de passe incorrect.");
  }
};

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-gray-100">
      <Card title="Connexion" className="w-full md:w-30rem">
        <form onSubmit={handleLogin} className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="username">Username</label>
            <InputText
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="password">Mot de passe</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>

          {errorMsg && (
            <small className="p-error block mb-3">{errorMsg}</small>
          )}

          <Button type="submit" label="Se connecter" className="w-full" />
        </form>

        <p className="mt-4 text-center text-sm">
          Pas de compte ?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Créer un compte
          </a>
        </p>
      </Card>
    </div>
  );
}
