import React, { useState } from 'react';
import axios from '../axiossettings/axios.jsx';
import { useNavigate } from 'react-router-dom';

const CreateIdeaForm = () => {
    const [form, setForm] = useState({
        title: '',
        short_description: '',
        target_audience: '',
        problem: '',
        solution: '',
        pricing: '',
        competitors: '',
        channels: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        for (const field in form) {
            if (!form[field]) {
                newErrors[field] = 'Поле обязательно';
            }
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                setLoading(true);
                const response = await axios.post('/IdeaCreate/', form);
                console.log('Успешно отправлено:', response.data);
                setSuccessMessage('Идея успешно отправлена!');

                
                setForm({
                    title: '',
                    short_description: '',
                    target_audience: '',
                    problem: '',
                    solution: '',
                    pricing: '',
                    competitors: '',
                    channels: ''
                });

             
                setTimeout(() => setSuccessMessage(''), 5000);
            } catch (error) {
                if (error.response) {
                    console.error('Ошибка при отправке:', error.response.data);
                } else {
                    console.error('Ошибка сети:', error);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>ЗАПУСТИТЬ СВОЮ ИДЕЮ</h1>
            <form onSubmit={handleSubmit} style={styles.form}>

                {[
                    { name: 'title', label: 'Название идеи', rows: 3 },
                    { name: 'short_description', label: 'Краткое описание', rows: 2 },
                    { name: 'target_audience', label: 'Целевая аудитория', rows: 3 },
                    { name: 'problem', label: 'Проблема', rows: 3 },
                    { name: 'solution', label: 'Решение', rows: 3 },
                    { name: 'pricing', label: 'Ценообразование', rows: 3 },
                    { name: 'competitors', label: 'Конкуренты', rows: 3 },
                    { name: 'channels', label: 'Каналы продвижения', rows: 3 }
                ].map(({ name, label, rows }) => (
                    <div key={name} style={styles.fieldContainer}>
                        <label style={styles.label}>{label}</label>
                        <textarea
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            placeholder="Введите текст..."
                            style={styles.textarea}
                            rows={rows}
                        />
                        {errors[name] && <p style={styles.error}>{errors[name]}</p>}
                    </div>
                ))}

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Отправка...' : 'Отправить идею'}
                </button>

                {loading && <h2 style={styles.loadingMessage}>Ожидание ответа от AI...</h2>}
                {successMessage && <h2 style={styles.successMessage}>{successMessage}</h2>}

                <button type="button" style={styles.backButton} onClick={() => navigate(-1)}>Вернуться</button>
            </form>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#000',
        color: 'white',
        minHeight: '100vh',
        padding: '32px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
    },
    title: {
        fontSize: '48px',
        marginBottom: '32px',
        background: 'white',
        WebkitBackgroundClip: 'text',
    },
    form: {
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    },
    fieldContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        marginBottom: '1px',
        fontSize: '20px',
        fontWeight: 'bold'
    },
    textarea: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#111',
        color: 'white',
    },
    error: {
        color: '#ff6b6b',
        fontSize: '20px',
        marginTop: '8px'
    },
    button: {
        backgroundColor: '#1a73e8',
        color: 'white',
        border: 'none',
        padding: '16px',
        fontSize: '20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    successMessage: {
        color: 'lightgreen',
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold'
    },
    loadingMessage: {
        color: '#FFD700',
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '18px'
    },
    backButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '15px',
        fontSize: '20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    }
};

export default CreateIdeaForm;
