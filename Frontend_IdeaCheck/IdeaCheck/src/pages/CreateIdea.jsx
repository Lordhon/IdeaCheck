import React, { useState } from 'react';
import axios from '../axiossettings/axios.jsx';
import { useNavigate } from 'react-router-dom';

const CreateIdeaForm = () => {
    const [form, setForm] = useState({title: '',short_description: '',target_audience: '',problem: '',solution: '',pricing: '',competitors: '',channels: ''});

    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [limitMessage, setLimitMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });//написал в поле title - 'Идея ' title'Идея' и все копируется 
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Для отменяет стандартное поведение страницы 
        setLimitMessage('');
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


            
                
              
            } catch (error) {
                if (error.response) {
                    console.error('Ошибка при отправке:', error.response.data);
                     if (error.response.status === 403 && error.response.data.error) {
                        setLimitMessage(error.response.data.error);
                     }
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

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Название идеи</label>
                    <textarea name="title" value={form.title} onChange={handleChange} placeholder="Введите текст..." style={styles.textarea} rows={3}/>
                    {errors.title && <p style={styles.error}>{errors.title}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Краткое описание</label>
                    <textarea name="short_description" value={form.short_description} onChange={handleChange} placeholder="Введите текст..." style={styles.textarea} rows={2}/>
                    {errors.short_description && <p style={styles.error}>{errors.short_description}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Целевая аудитория</label>
                    <textarea name="target_audience" value={form.target_audience} onChange={handleChange} placeholder="Введите текст..." style={styles.textarea} rows={3}/>
                    {errors.target_audience && <p style={styles.error}>{errors.target_audience}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Проблема</label>
                    <textarea name="problem" value={form.problem} onChange={handleChange} placeholder="Введите текст..." style={styles.textarea} rows={3}/>
                    {errors.problem && <p style={styles.error}>{errors.problem}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Решение</label>
                    <textarea name="solution" value={form.solution} onChange={handleChange} placeholder="Введите текст..." style={styles.textarea} rows={3}/>
                    {errors.solution && <p style={styles.error}>{errors.solution}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Ценообразование</label>
                    <textarea name="pricing" value={form.pricing} onChange={handleChange} placeholder="Введите текст..." style={styles.textarea} rows={3}/>
                    {errors.pricing && <p style={styles.error}>{errors.pricing}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Конкуренты</label>
                    <textarea name="competitors" value={form.competitors} onChange={handleChange} placeholder="Введите текст..." style={styles.textarea}  rows={3}/>
                    {errors.competitors && <p style={styles.error}>{errors.competitors}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Каналы продвижения</label>
                    <textarea name="channels" value={form.channels} onChange={handleChange} placeholder="Введите текст..." style={styles.textarea} rows={3}/>
                    {errors.channels && <p style={styles.error}>{errors.channels}</p>}
                </div>

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Отправка...' : 'Отправить идею'}
                </button>

                {loading && <h2 style={styles.loadingMessage}>Ожидание ответа от AI...</h2>}

                {successMessage && <h2 style={styles.successMessage}>{successMessage}</h2>}
                {limitMessage && <p style={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '10px', textAlign: 'center' }}>{limitMessage}</p>}

                <button type="button" style={styles.backButton}onClick={() => navigate(-1)}>Вернуться</button>
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
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '15px'
    },
    loadingMessage: {
        color: '#FFD700',
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '15px'
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
