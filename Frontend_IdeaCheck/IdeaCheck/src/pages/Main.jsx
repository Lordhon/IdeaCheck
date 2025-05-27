import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../axiossettings/axios.jsx";


const App = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState({});

    useEffect(() =>   {
        const getRole = async () => {
            try {
                const res = await axios.get('/account/');
                setRole(res.data.role);
            }catch(err) {
                console.log(err);
            }

        };
        getRole();



    },[])


    return (
        <div style={containerStyle}>
            <div style={accountButtonContainer}>
                <button style={accountButton} onClick={() => navigate('/account')}>
                    Аккаунт
                </button>
            </div>

            <div style={actionButtonsContainer}>
                <button style={buttonStyle} onClick={()=> {if (role ==='investor' ) {navigate('/investor/review/')}else navigate('/investor/application/')}}>{role=== 'investor'? 'СМОТРЕТЬ РАБОТЫ ': 'СТАТЬ ИНВЕСТОРОМ'}</button>
                <button style={buttonStyle} onClick={() => {if (role ==='expert') {navigate('/expert/review/')}else navigate('/expert/application/')}}>{role=== 'expert'? 'ПРОВЕРЯТЬ РАБОТЫ ': 'СТАТЬ ЭКСПЕРТОМ'}</button>
                {role === 'moderator' && (<button style={buttonStyle} onClick={() => {navigate('/admin/');}}>Админка</button>
                )}

            </div>

            <div>
                <h1 style={mainTitle}>IdeaCheck</h1>
                <button onClick={() => navigate('/create-idea/')} style={ideaButtonStyle}>
                    ЗАПУСТИТЬ  ИДЕЮ
                    <span style={ideaButtonSubtext}>Получить профессиональную и AI оценку</span>
                </button>

            </div>
            <br/>
            <h2 style={teamTitle}>Наша команда</h2>
            <br/>
            <br/>


            <div style={teamContainer}>
                <div style={memberStyle}>
                    <img src="/man1.png" alt="Александр Петров" style={imgStyle} />
                    <h3>Александр Петров</h3>
                    <p style={roleStyle}>Инвестор</p>
                    <p style={bioStyle}>Инвестор в IT-стартапы, 10+ лет опыта</p>
                </div>

                <div style={memberStyle}>
                    <img src="/woman1.png" alt="Мария Иванова" style={imgStyle} />
                    <h3>Мария Иванова</h3>
                    <p style={roleStyle}>Инвестор</p>
                    <p style={bioStyle}>Специалист по биотехнологиям</p>
                </div>

                <div style={memberStyle}>
                    <img src="/man2.png" alt="Дмитрий Смирнов" style={imgStyle} />
                    <h3>Дмитрий Смирнов</h3>
                    <p style={roleStyle}>Эксперт</p>
                    <p style={bioStyle}>Бизнес-аналитик, 120+ проектов</p>
                </div>

                <div style={memberStyle}>
                    <img src="/woman2.png" alt="Елена Кузнецова" style={imgStyle} />
                    <h3>Елена Кузнецова</h3>
                    <p style={roleStyle}>Эксперт</p>
                    <p style={bioStyle}>Маркетолог, экс-Google</p>
                </div>
            </div>
        </div>
    );
};


const containerStyle = {
    width: '100vw',
    padding: '32px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
};

const accountButtonContainer = {
    position: 'absolute',
    top: '30px',
    right: '50px',

};

const accountButton = {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '20px 80px',
    fontSize: '16px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const actionButtonsContainer = {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginBottom: '64px',

};

const buttonStyle = {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',

};



const mainTitle = {
    fontSize: '56px',
    marginBottom: '16px',



};

const ideaButtonStyle = {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '24px 48px',
    fontSize: '24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    margin: '32px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    width: '100%'
};

const ideaButtonSubtext = {
    fontSize: '14px',
    fontWeight: 'normal',
    marginTop: '8px',
    opacity: '0.8'
};

const teamTitle = {
    fontSize: '32px',
    margin: '48px 0 16px',
    color: 'White'
};

const teamContainer = {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    margin: '48px auto',

};

const memberStyle = {
    flex: '1 1 220px',
    maxWidth: '250px',
    margin: '16px',
    boxSizing: 'border-box'
};

const imgStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    marginBottom: '16px'
};

const roleStyle = {
    color: '#1a73e8',
    fontWeight: 'bold'
};

const bioStyle = {
    color: '#bdc1c6',
    fontSize: '14px',
};

export default App;
