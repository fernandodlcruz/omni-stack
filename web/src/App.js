import React, { useState, useEffect } from 'react';
import api from './services/api';
import DevItem from './components/DevItem';

import './global.css';
import './app.css';
import './sidebar.css';
import './main.css';

function App() {
  const [latitude, setLat] = useState('');
  const [longitude, setLong] = useState('');
  const [github_username, setGit] = useState('');
  const [techs, setTechs] = useState('');
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      
      setLat(latitude);
      setLong(longitude);
    }, 
      err => {
        console.log(err);        
      },
      {
        timeout: 30000
      });
  }, []);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude
    });

    setTechs('');
    setGit('');
    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username">Github user:</label>
            <input name="github_username" id="github_username" required value={github_username} onChange={e => setGit(e.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="techs">Technologies:</label>
            <input name="techs" id="techs" required value={techs} onChange={e => setTechs(e.target.value)} />
          </div>

          <div className="input-group">
            <div className="input-block">
              <label htmlFor="lat">Latitude:</label>
              <input type="number" name="lat" id="lat" required value={latitude} onChange={e => setLat(e.target.value)} />
            </div>
            <div className="input-block">
              <label htmlFor="long">Longitutde:</label>
              <input type="number" name="long" id="long" required value={longitude} onChange={e => setLong(e.target.value)} />
          </div>
          </div>
          <button type="submit">Save</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem dev={dev} key={dev._id} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
