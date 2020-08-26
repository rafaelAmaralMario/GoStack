import React, {useEffect, useState} from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, StatusBar, Platform, TouchableOpacity } from 'react-native';
import api from './services/api';

export default function App() {
    const [projects, setProjects] = useState([]);

    useEffect( () => {
        api.get('projects').then( response => {
            setProjects(response.data);
        })
    }, []);


    async function handleAddProject() {
        const response = await api.post('projects', {
            "title" : `Project add at mobile ${Date.now()}`,
	        "owner" : "Rafael"
        });
        setProjects([...projects, response.data]);
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#7159c1"/>
            <SafeAreaView style={styles.container}>
                <FlatList  
                    data={projects}
                    keyExtractor={project => project.id}
                    // renderItem={({item}) => (<Text style={styles.title}>{item.title}</Text>)} both are right
                    renderItem={({item : project}) => (<Text style={styles.title}>{project.title}</Text>)}
                />

                <TouchableOpacity 
                    activeOpacity={0.6} 
                    style={styles.button} 
                    onPress={handleAddProject}
                >
                    <Text style={styles.buttonText}>Add project</Text>                    
                </TouchableOpacity>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#7159c1',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
    title: {
        color: '#fff',
        fontSize: 20,
    },
    button: {
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        margin: 20,
        height: 50,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#7159c1',
    }

})
