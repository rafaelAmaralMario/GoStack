const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4'); 

const app = express();

app.use(cors());
app.use(express.json());

const projects = [];


function logRequest(request, response, next) {
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.time(logLabel);
    next();
    console.timeEnd(logLabel);
} 
function validadeProjectId(request, response, next) {
    const {id} = request.params;

    if(!isUuid(id)) {
        return res.status(400).json({ message: 'Invalid project ID'})
    }

    return next();

}
app.use(logRequest);
app.use('/projects/:id', logRequest);

app.get('/projects', (req, res) => {
    const {title, owner} = req.query;
    const filteredProjects = projects.filter( project =>  (project.title.includes(title)  || !title) && (project.owner.includes(owner)  || !owner)  )

    return res.json(filteredProjects);
})

app.post('/projects', (req, res) => {
    const { title, owner }  = req.body;
    if(!title) {
        res.status(400).json({ message: 'Title is mandatory'})
    } else if(! owner) {
        res.status(400).json({ message: 'Owner is mandatory'})
    } else {
        const project = { id: uuid(), title, owner  }
        projects.push(project)
        return res.json(project);
    }
})

app.put('/projects/:id', (req, res) => {
    const {id} = req.params;
    const { title, owner } = req.body;
    const projectIndex = projects.findIndex( project => project.id === id );

    if(projectIndex < 0) {
        return res.status(400).json({ message: 'Project not found'})
    }
    const project = { id, title, owner  }
    projects[projectIndex] = project;

    return res.json(project);
})

app.delete('/projects/:id', (req, res) => {
    const {id} = req.params;
    const projectIndex = projects.findIndex( project => project.id === id );

    if(projectIndex < 0) {
        return res.status(400).json({ message: 'Project not found'})
    }

    projects.splice(projectIndex, 1)
    
    return res.status(204).send();
})

app.listen(3333, () =>{
    console.log('🚀 Backend Started')
});
