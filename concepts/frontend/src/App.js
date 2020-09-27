import react, {useState, useEffect} from 'react';

import Header from './components/Header';
import './App.css'
import api from './services/api';


function App() {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        api.get('projects').then( response => {
            setProjects(response.data);
        })
    }, []);

    async function handleAddProject() {
        // setProjects([...projects, `New Project ${Date.now()}`]);
        const response = await api.post('projects', {
            title: `New Project ${Date.now()}`,
            owner: 'Rafael Mario'
        })
        setProjects([...projects, response.data]);
    }

    return (
        <>
            <Header title="Home Page" />
            <img src={backgroundImage}/>
            {
                projects.map(project => (
                    <h2 key={project.id}>{project.title}</h2>
                ))
            }

            <button type="button" onClick={handleAddProject}>Add project</button>
        </>
    )
}

export default App;
