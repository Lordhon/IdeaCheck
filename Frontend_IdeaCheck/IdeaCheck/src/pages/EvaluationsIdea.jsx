import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiossettings/axios.jsx";

const EvaluationsIdea = () => {
    const [form, setForm] = useState({
        relevance: '',
        innovation: '',
        feasibility: '',
        scalability: '',
        clarity: '',
        comment: ''
    });
    const [idea, setIdea] = useState(null);
    const [error, setError] = useState({});
    const [message, setMessage] = useState('');
    const { id } = useParams();
    const [role, setRole] = useState(null);


       useEffect(() =>{
        axios.get('/account/').then(response => {
            setRole(response.data.role)
            if (response.data.role !== 'moderator') {
                navigate('/IdeaCheck/');

            }

        }).catch(error => console.log(error));

    })

    useEffect(() => {
        axios.get(`/ideas/${id}/`)
            .then(response => setIdea(response.data))
            .catch(error => {
                console.error('Ошибка при получении идеи:', error);
                setMessage('Не удалось загрузить идею.');
            });
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        // Проверяем обязательные поля
        for (const field in form) {
            if (!form[field]) {
                newErrors[field] = 'Обязательное поле';
            }
        }
        setError(newErrors);
        setMessage('');

        if (Object.keys(newErrors).length === 0) {
            try {
                await axios.post(`/ideas/${id}/evaluate/`, form);
                setMessage('Оценка успешно отправлена!');
                setForm({
                    relevance: '',
                    innovation: '',
                    feasibility: '',
                    scalability: '',
                    clarity: '',
                    comment: ''
                });

            } catch (err) {
                console.log(err);
                setMessage('Ошибка при отправке оценки.');
            }
        }
    };

    return (
        <div style={styles.page}>
            {idea && (
                <div style={styles.ideaCard}>
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
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <h3 style={styles.formTitle}>Оценить идею</h3>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Актуальность</label>
                    <select
                        name="relevance"
                        value={form.relevance}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите оценку</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                    {error.relevance && <span style={styles.error}>{error.relevance}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Инновация</label>
                    <select
                        name="innovation"
                        value={form.innovation}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите оценку</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                    {error.innovation && <span style={styles.error}>{error.innovation}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Осуществимость</label>
                    <select
                        name="feasibility"
                        value={form.feasibility}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите оценку</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                    {error.feasibility && <span style={styles.error}>{error.feasibility}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Масштабируемость</label>
                    <select
                        name="scalability"
                        value={form.scalability}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите оценку</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                    {error.scalability && <span style={styles.error}>{error.scalability}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Ясность</label>
                    <select
                        name="clarity"
                        value={form.clarity}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="">Выберите оценку</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                    {error.clarity && <span style={styles.error}>{error.clarity}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Комментарий</label>
                    <textarea
                        name="comment"
                        value={form.comment}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="Оставьте свои мысли..."
                    />
                    {error.comment && <span style={styles.error}>{error.comment}</span>}
                </div>

                <button type="submit" style={styles.button}>Отправить оценку</button>

                {message && (
                    <div style={styles.message}>{message}</div>
                )}
            </form>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '32px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
    },
    ideaCard: {
        backgroundColor: '#111',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(255,255,255,0.05)'
    },
    form: {
        backgroundColor: '#111',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(255,255,255,0.05)'
    },
    formTitle: {
        marginBottom: '16px',
        color: '#8ab4f8'
    },
    formGroup: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        marginBottom: '5px'
    },
    select: {
        width: '100%',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #333',
        backgroundColor: '#222',
        color: '#fff'
    },
    textarea: {
        width: '100%',
        minHeight: '80px',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #333',
        backgroundColor: '#222',
        color: '#fff',
        resize: 'vertical'
    },
    button: {
        backgroundColor: '#1a73e8',
        color: '#fff',
        padding: '13px 24px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    },
    error: {
        color: '#f44336',
        fontSize: '14px'
    },
    message: {
        marginTop: '16px',
        padding: '13px',
        backgroundColor: '#222',
        borderRadius: '6px',
        borderLeft: '4px solid #1a73e8',
        color: '#8ab4f8',
        fontWeight: 'bold'
    }
};

export default EvaluationsIdea;
