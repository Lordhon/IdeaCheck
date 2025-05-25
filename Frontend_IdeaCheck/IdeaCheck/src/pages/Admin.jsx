import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from '../axiossettings/axios.jsx';

const AdminPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(null);


       useEffect(() =>{
        axios.get('/account/').then(response => {
            setRole(response.data.role)
            if (response.data.role !== 'moderator') {
                navigate('/IdeaCheck/');

            }

        }).catch(error => console.log(error));

    } , [])

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#000',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
        },
        title: {
            fontSize: '32px',
            marginBottom: '40px',
            color: '#1a73e8',
        },
        button: {
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            fontSize: '18px',
            borderRadius: '10px',
            cursor: 'pointer',
            margin: '10px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Выберите тип заявки</h1>
            <button style={styles.button} onClick={() => navigate('/investot/application/cheking/')}>
                Заявка на инвестора
            </button>
            <button style={styles.button} onClick={() => navigate('/expert/application/cheking/')}>
                Заявка на эксперта
            </button>
        </div>
    );
};

export default AdminPage;
