import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../axiossettings/axios.jsx";

const Account = () => {
    const [profile, setProfile] = useState(null);
    const [ideas, setIdeas] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        axios.get('/account/')
            .then(response => setProfile(response.data))
            .catch(error => console.error("Ошибка при получении данных профиля:", error));

        axios.get('/MyIdea/')
            .then(response => setIdeas(response.data))
            .catch(error => console.error("Ошибка при получении идей:", error));
    }, []);

    if (!profile) return <div style={styles.loading}>Загрузка...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.profileSection}>
                <h2 style={styles.sectionTitle}>Профиль</h2>
                <p><strong>Имя:</strong> {profile.first_name} {profile.last_name}</p>
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Роль:</strong> {profile.role}</p>
                <p><strong>Статус:</strong> {profile.status}</p>
                
                    <button onClick={() => navigate('https://t.me/CheckIdeasBot')} style={styles.subscribeButton}>Купить подписку</button>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
           
                    <button onClick={handleLogout} style={styles.logoutButton}>Выйти</button>
            </div>

            <div style={styles.ideaSection}>
                <h2 style={styles.sectionTitle}>Мои идеи</h2>
                {ideas.length > 0 ? (
                    ideas.map((idea, index) => (
                        <div key={index} style={styles.ideaCard}>
                            <div style={styles.ideaHeader}>
                                <h3 style={styles.ideaTitle}>{idea.title}</h3>
                                <button
                                    style={styles.detailsButton}
                                    onClick={() => navigate(`/idea/${idea.id}`)}
                                >
                                    Подробнее
                                </button>
                            </div>
                            <p style={styles.ideaDescription}>{idea.description}</p>
                        </div>
                    ))
                ) : (
                    <p style={styles.noIdeasText}>У вас пока нет идей.</p>
                )}
            </div>
        </div>
    );
};




const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#000',
        color: 'white',
        padding: '32px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
    },
    profileSection: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: '12px',
        padding: '32px',
        marginRight: '32px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)',
    },
    ideaSection: {
        flex: 2,
        backgroundColor: '#111',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)',
    },
    sectionTitle: {
        marginBottom: '16px',
        color: '#8ab4f8',
    },
    logoutButton: {
        marginTop: '20px',
        backgroundColor: '#e53935',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    ideaCard: {
        backgroundColor: '#222',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        color: '#fff',
        boxShadow: '0 0 5px rgba(255,255,255,0.05)',
    },
    ideaHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    ideaTitle: {
        margin: 0,
        color: '#f1f1f1',
    },
    detailsButton: {
        backgroundColor: '#1a73e8',
        color: 'white',
        border: 'none',
        padding: '7px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '15px',
    },
    ideaDescription: {
        margin: 0,
        opacity: 0.85,
    },
    noIdeasText: {
        opacity: 0.8,
    },
    loading: {
        color: 'white',
        textAlign: 'center',
    },
    subscribeButton: {
    marginTop: '15px',
    backgroundColor: '#4caf50',  
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    width: '100%',  
}
};

export default Account;