import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiossettings/axios.jsx';

const IdeaDetail = () => {
    const { id } = useParams();
    const [idea, setIdea] = useState(null);
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [average_rating, setAverage_rating] = useState();

    useEffect(() => {
        axios.get(`/idea/${id}/`)
            .then(response => {
                setIdea(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при получении идеи:', error);
                setLoading(false);
            });
    }, [id]);


    useEffect(() => {
        axios.get(`/ideas/${id}/evaluations/`)
            .then(response => {
                setEvaluations(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении оценок:', error);
            });
    }, [id]);
    useEffect(() => {
        axios.get(`/ideas/${id}/avg/`).then(response => {
            setAverage_rating(response.data);
        })

    }, [id]);

    if (loading) return <div style={{ color: 'white' }}>Загрузка...</div>;
    if (!idea) return <div style={{ color: 'white' }}>Идея не найдена</div>;

    return (
        <div style={{
            backgroundColor: '#000',
            color: 'white',
            padding: '32px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: '#111',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 0 10px rgba(255,255,255,0.1)',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                <h1 style={{ color: '#8ab4f8' }}>{idea.title}</h1>
                <p><strong>Краткое описание:</strong> {idea.short_description}</p>
                <p><strong>Целевая аудитория:</strong> {idea.target_audience}</p>
                <p><strong>Проблема:</strong> {idea.problem}</p>
                <p><strong>Решение:</strong> {idea.solution}</p>
                <p><strong>Ценообразование:</strong> {idea.pricing}</p>
                <p><strong>Конкуренты:</strong> {idea.competitors}</p>
                <p><strong>Каналы продвижения:</strong> {idea.channels}</p>
                <p><strong>Email автора:</strong> {idea.email}</p>
                <p><strong>AVG идеи:</strong> {average_rating}</p>

                <p style={{ opacity: 0.7 }}><strong>Создана:</strong> {new Date(idea.created_at).toLocaleString()}</p>
            </div>

            <div style={{ marginTop: '32px' }}>
                <h2 style={{ color: '#8ab4f8' }}>Оценки экспертов</h2>
                {evaluations.length === 0 ? (
                    <p>Оценок пока нет.</p>
                ) : (
                    evaluations.map((evaluation) => (
                        <div key={evaluation.id} style={{
                            backgroundColor: '#1a1a1a',
                            marginTop: '16px',
                            padding: '16px',
                            borderRadius: '10px'
                        }}>
                            <p><strong>Имя:</strong> {evaluation.first_name}</p>
                            <p><strong>Фамилия:</strong> {evaluation.last_name}</p>
                            <p><strong>Инновационность:</strong> {evaluation.innovation}</p>
                            <p><strong>Выполнимость:</strong> {evaluation.feasibility}</p>
                            <p><strong>Масштабируемость:</strong> {evaluation.scalability}</p>
                            <p><strong>Понятность:</strong> {evaluation.clarity}</p>
                            <p><strong>Актуальность:</strong> {evaluation.relevance}</p>
                            <p><strong>Комментарий:</strong> {evaluation.comment}</p>
                            <p style={{ opacity: 0.7 }}><strong>Оценено:</strong> {new Date(evaluation.created_at).toLocaleString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default IdeaDetail;
