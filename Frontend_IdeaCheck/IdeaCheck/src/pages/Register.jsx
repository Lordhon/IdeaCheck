import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";



function Register() {
    const [formData, setFormData] = useState({username: '', password: '', email: '', first_name: '', last_name: ''});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = {
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            };
            

            const response = await axios.post(
                "http://87.228.89.66/api/register/",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Успешный ответ:", response.data);
            navigate("/login");
        } catch (err) {

            console.error("Полная ошибка:", err);
            console.error("Ответ сервера:", err.response?.data);
            if(err.response && err.response.data) {
                setErrors(err.response.data);
            }
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.logo}>IdeaCheck</div>
            <div style={styles.layout}>
                <div style={styles.leftSide}>
                    <img src="/bisnesman.jpg" alt="Left" style={styles.leftImage} />
                </div>
                <div style={styles.formBox}>
                    <h2 style={styles.title}>Регистрация</h2>
                    <form onSubmit={handleRegister} style={styles.form}>
                        <input name="username" type="text" placeholder="Имя пользователя" value={formData.username} onChange={handleChange} required style={styles.input} />{errors.username && <div style={styles.error}>{errors.username[0]}</div>}
                        <input name="first_name" type="text" placeholder="Имя" value={formData.first_name} onChange={handleChange} required style={styles.input} />
                        <input name="last_name" type="text" placeholder="Фамилия" value={formData.last_name} onChange={handleChange} required style={styles.input} />
                        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />{errors.email && <div style={styles.error}>{errors.email[0]}</div>}
                        <input name="password" type="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required style={styles.input} />
                        <button type="submit" style={styles.button}>Зарегистрироваться</button>
                        <a href="/login" style={styles.link}>Войти</a>
                    </form>
                </div>
                <div style={styles.rightSide}>
                    <img src="/bisnesman1.png" alt="Right" style={styles.rightImage} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    error: {
        color: 'red',
        fontSize: 18,

    },
    page: {
        backgroundColor: '#000',
        color: 'white',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 40,
        boxSizing: 'border-box',
        margin: 0,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },
    layout: {
        display: 'flex',
        width: '100%',
        maxWidth: 1300,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 60
    },
    leftSide: {
        width: 250,
        height: 400,
        marginLeft: -60,
    },
    rightSide: {
        width: 250,
        height: 400,
        marginRight: -60,
    },
    leftImage: {
        width: '180%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 10,
        marginLeft: -200,
    },
    rightImage: {
        width: '180%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 10,
        marginRight: -40,
    },
    formBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        marginBottom: 20,
        fontSize: 24
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: 450,
    },
    input: {
        padding: 12,
        marginBottom: 15,
        borderRadius: 6,
        border: '1px solid #ccc',
        fontSize: 16
    },
    button: {
        padding: 12,
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16
    },
    link: {
        marginTop: 10,
        textDecoration: 'none',
        color: '#66b3ff',
        textAlign: 'center',
        fontSize: 14
    }
};

export default Register;