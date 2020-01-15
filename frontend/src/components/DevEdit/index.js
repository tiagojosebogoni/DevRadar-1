import React from "react";

// import { Container } from './styles';

export default function DevEdit({
  name,
  techs,
  avatar_url,
  bio,
  latitude,
  longitude
}) {
  return (
    <li className="dev-item">
      <form onSubmit={handleEditUser}>
        <header>
          <div className="info">
            <img src={dev.avatar_url} alt={dev.name} />
          </div>

          <div className="settings">
            <button type="submit">Salvar</button>

            <button type="button" onClick={handleCloseEdit}>
              Cancelar
            </button>
          </div>
        </header>

        <div className="user-edit">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder={dev.name}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label htmlFor="techs2">Techs</label>
          <input
            type="text"
            name="techs"
            id="techs2"
            placeholder={dev.techs}
            value={techs}
            onChange={e => setTechs(e.target.value)}
            required
          />

          <label htmlFor="avatar_url">Avatar Url</label>
          <input
            type="url"
            name="avatar_url"
            id="avatar_url"
            placeholder="Insira o link da sua foto"
            value={avatar_url}
            onChange={e => setAvatarUrl(e.target.value)}
            required
          />

          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            placeholder={dev.bio}
            value={bio}
            onChange={e => setBio(e.target.value)}
            required
          ></textarea>

          <label htmlFor="latitude2">Latitude</label>
          <input
            type="number"
            name="latitude"
            id="latitude2"
            placeholder={dev.location.coordinates[1]}
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            required
          />

          <label htmlFor="longitude2">Longitude</label>
          <input
            type="number"
            name="longitude"
            id="longitude2"
            placeholder={dev.location.coordinates[0]}
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            required
          />
        </div>
      </form>
    </li>
  );
}
