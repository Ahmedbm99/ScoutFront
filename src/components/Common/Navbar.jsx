import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function Navbar({ username = "Scouty" }) {
  const [showDialog, setShowDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer le token ou toute autre info de session
    localStorage.removeItem("token");
    navigate("/");
  };

  const logo = (
    <div
      className="flex align-items-center gap-2 cursor-pointer"
      onClick={() => navigate("/home")}
    >
      <img src="../../../public/logo.jpg" alt="logo" height="60" className="mr-2" />
      <span className="font-bold text-xl">العبور</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <span className="font-semibold">{username}</span>
      <Avatar
        icon="pi pi-cog"
        shape="circle"
        className="cursor-pointer"
        onClick={() => setShowDialog(true)}
      />
      <Button
        icon="pi pi-sign-out"
        className="p-button-text p-button-sm"
        label="Déconnexion"
        onClick={handleLogout}
      />
    </div>
  );

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // Logique pour modifier le mot de passe (API à appeler)
    alert("Mot de passe modifié avec succès !");
    setShowDialog(false);
  };

  return (
    <>
      <Menubar start={logo} end={end} />

      <Dialog
        header="Modifier le mot de passe"
        visible={showDialog}
        style={{ width: "30vw" }}
        onHide={() => setShowDialog(false)}
        modal
      >
        <div className="flex flex-column gap-3 mt-2">
          <span className="p-float-label">
            <Password
              id="oldPass"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              feedback={false}
            />
            <label htmlFor="oldPass">Ancien mot de passe</label>
          </span>

          <span className="p-float-label">
            <Password
              id="newPass"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              feedback={true}
            />
            <label htmlFor="newPass">Nouveau mot de passe</label>
          </span>

          <span className="p-float-label">
            <Password
              id="confirmPass"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              feedback={false}
            />
            <label htmlFor="confirmPass">Confirmer le mot de passe</label>
          </span>

          <div className="flex justify-content-end mt-4">
            <Button
              label="Annuler"
              className="p-button-text mr-2"
              onClick={() => setShowDialog(false)}
            />
            <Button label="Modifier" onClick={handleChangePassword} />
          </div>
        </div>
      </Dialog>
    </>
  );
}
