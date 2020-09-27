import {Request, Response} from 'express';
import createUser from './services/CreateUser';

export function helloWorld(request: Request, response:Response) { 
    const user = createUser({
        email: 'rafael@mail.com',
        password: '123456',
        techs: [
            'Node.js', 
            'React', 
            'VueJS', 
            'Angular',
            'Flutter',
            'Python',
            'R', 
            {
                title: 'Javascript',
                experience: 100
            },
            {
                experience: 100,
                title: 'React'
            }
        ]
    });


    return response.json({
        message: 'User Created',
        user
    });
}
