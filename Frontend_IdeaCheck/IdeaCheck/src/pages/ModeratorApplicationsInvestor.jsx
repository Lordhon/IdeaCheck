
import React, { useEffect, useState } from 'react';
import axios from "../axiossettings/axios.jsx";
import {useNavigate} from "react-router-dom";

const ModeratorApplicationInvestor = () => {
    const [role, setRole] = useState(null);
    const [applications, setApplication] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    useEffect(() =>{
        axios.get('/account/').then(response => {
            setRole(response.data.role)
            if (response.data.role !== 'moderator') {
                navigate('/IdeaCheck/');

            }

        }).catch(error => console.log(error));

    })
    useEffect(() => {
        axios.get('/investor/applications/get/').then(response => setApplication(response.data)).catch(error => console.log(error));
        setMessage('Ошибка загрузки заявок');

    } ,[]);

    const handleApprove = async (id) => {
        try {
            const response = await axios.post(`/investor/applications/${id}/approve/`)
            setMessage('Заявка одобрена')
            setApplication(applications.filter(item => item.id !== id));

        }catch(error) {
            console.log(error);
            setMessage('Ошибка при одобрении')
        }
    }

    const handleReject = async (id) => {
        try {
            const response = await axios.post(`/investor/applications/${id}/reject/`)
            setMessage('Заявка отклонена')
            setApplication(applications.filter(item => item.id !== id));

        }catch(error) {
            console.log(error);
            setMessage('Ошибка при отклонении')
        }
    };

    return (
        <div >
            <h2>Заявки инвесторов</h2>

            {applications.length === 0 ? (
                <p>Заявок нет</p>
            ) : (
                applications.map(app => (
                    <div key={app.id} style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                        backgroundColor: 'black'
                    }}>
                        <h3>{app.first_name} {app.last_name}</h3>
                        <p><strong>Email:</strong> {app.email}</p>
                        <p><strong>О себе:</strong> {app.about}</p>
                        <p><strong>Опыт:</strong> {app.experience}</p>
                        <p><strong>Проект:</strong> {app.project}</p>
                        <p><strong>Статус:</strong> {app.status}</p>

                        <button onClick={() => handleApprove(app.id)} style={{ marginRight: '16px', backgroundColor: 'green', color: 'white' }}>
                            Принять
                        </button>
                        <button onClick={() => handleReject(app.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                            Отклонить
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};




export default ModeratorApplicationInvestor;