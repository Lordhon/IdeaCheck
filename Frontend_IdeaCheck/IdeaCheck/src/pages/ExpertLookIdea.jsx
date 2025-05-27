import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../axiossettings/axios.jsx";

const IdeaList = () => {
    const [ideas, setIdeas] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [role, setRole] = useState(null);


       useEffect(() =>{
        axios.get('/account/').then(response => {
            setRole(response.data.role)
            if (response.data.role !== 'expert') {
                navigate('/IdeaCheck/');

            }

        }).catch(error => console.log(error));

    },[])

    useEffect(() => {
        axios.get('/ideas/')
            .then((response) => {
                setIdeas(response.data);
            })
            .catch((error) => {
                console.log(error);
                setError('Ошибка при загрузке идей.');
            });
    }, []);

    return (
    <div>
        {ideas.length === 0 ? (
            <div style={styles.noIdeasMessage}>
                <h3>Идей пока нет</h3>   
            </div>
        ) : (
            ideas.map(idea => (
                <div key={idea.id} style={styles.card}>
                    <h2>{idea.title}</h2>
                    <p><strong>Описание:</strong> {idea.short_description}</p>
                    <p><strong>Целевая аудитория:</strong> {idea.target_audience}</p>
                    <p><strong>Проблема:</strong> {idea.problem}</p>
                    <p><strong>Решение:</strong> {idea.solution}</p>
                    <p><strong>Ценообразование:</strong> {idea.pricing}</p>
                    <p><strong>Конкуренты:</strong> {idea.competitors}</p>
                    <p><strong>Каналы продвижения:</strong> {idea.channels}</p>
                    <p><em>Создано: {new Date(idea.created_at).toLocaleString()}</em></p>
                    <p><strong>Контакт:</strong> {idea.email}</p>
                    <button 
                        style={styles.button} 
                        onClick={() => navigate(`/ideas/evaluations/${idea.id}/`)}
                    >
                        Оценить
                    </button>
                </div>
            ))
        )}
    </div>
);

}
const styles = {
    noIdeasMessage:{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        margin: '20px 0'
    },
    card: {
        border: '1px solid #ccc',
        margin: '16px',
        padding: '16px',
        borderRadius: '8px',

        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    button: {
        marginTop: '16px',
        padding: '8px 16px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default IdeaList;
