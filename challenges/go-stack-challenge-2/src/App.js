import React, {useEffect, useState} from "react";

import "./styles.css";
import api from './services/api';


function App() {
  const [repositories, setRepositories] = useState([]);
  
  useEffect(() => {
    api.get('repositories').then( response => {
      setRepositories(response.data);
    })

  }, []);

  async function handleAddRepository() {
    const newRepository = {
        "url": `https://github.com/Rocketseat/new-repo-${Date.now()}`,
        "title": `New Repository ${Date.now()}`,
        "techs": ["React", "ReactNative", "TypeScript", "ContextApi"]
      }
    const response = await api.post('repositories', newRepository);
    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`/repositories/${id}`)
    if(response.status === 204) {
      const repositoriesUpdated = repositories.filter(repository => repository.id !== id);
      setRepositories(repositoriesUpdated);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map( reposotory => (
          <li key={reposotory.id}>
            <label>{reposotory.title}</label> 
            <button onClick={() => handleRemoveRepository(reposotory.id)}>
              Remover
            </button>
          </li>
          
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
