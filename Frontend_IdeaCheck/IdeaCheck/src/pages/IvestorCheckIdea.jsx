import axios from "../axiossettings/axios.jsx";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

const InvestorCheckIdea = () => {

    const [idea , setIdea] = useState({});
    const [error , setError] = useState({});
     const [role , setRole] = useState({});

    
     useEffect(() =>{
        axios.get('/account/').then(response => {
            setRole(response.data.role)
            if (response.data.role !== 'investor') {
                navigate('/IdeaCheck/');

            }

        }).catch(error => console.log(error));

    })

      


    useEffect( () => {
        axios.get('/ideas/investor/')
        .then((response) => {
            setIdea(response.data);


        }).catch((error) => {
        console.log(error);

    })

    },[])
    return (
        <div style={{ padding: '20px' }}>
            {idea.length > 0 ? (
                idea.map((idea, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: '#222',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '24px',
                            color: '#fff',
                            boxShadow: '0 0 5px rgba(255,255,255,0.05)',
                        }}
                    >
                        <h3>{idea.title}</h3>
                        <p><strong>Краткое описание:</strong> {idea.short_description}</p>
                        <p><strong>Целевая аудитория:</strong> {idea.target_audience}</p>
                        <p><strong>Проблема:</strong> {idea.problem}</p>
                        <p><strong>Решение:</strong> {idea.solution}</p>
                        <p><strong>Ценообразование:</strong> {idea.pricing}</p>
                        <p><strong>Конкуренты:</strong> {idea.competitors}</p>
                        <p><strong>Каналы продвижения:</strong> {idea.channels}</p>
                        <p><strong>Email автора:</strong> {idea.email}</p>
                        <p><strong>AVG идеи:</strong> {idea.average_rating}</p>
                    </div>
                ))
            ) : (
                <p style={{ color: '#fff' }}>Идей пока нет.</p>
            )}


        </div>
    );

};

export default InvestorCheckIdea;