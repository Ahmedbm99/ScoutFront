import React from 'react';
import { MultiSelect } from 'primereact/multiselect';

function UserSelector({ users, selectedUsers, setSelectedUsers }) {
  return (
    <div className="user-selector">
      <MultiSelect
        value={selectedUsers}
    options={users}
        onChange={(e) => setSelectedUsers(e.value)}
        optionLabel="username"  // Propriété à afficher, adapte selon ton objet utilisateur
        placeholder="Sélectionnez des utilisateurs"
        filter 
        display="chip" // Affiche les éléments sélectionnés sous forme de chips
        className="w-full"
      />
    </div>
  );
}

export default UserSelector;
