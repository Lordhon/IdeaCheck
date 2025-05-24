import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/login/",formData);

            localStorage.setItem("token", response.data.access);
            localStorage.setItem("loggedIn", true);
            navigate("/IdeaCheck/");
        } catch (err) {
            console.error("Ошибка входа:", err.response?.data);
            setError(err.response?.data?.detail || "Неверный логин или пароль");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.logo}>IdeaCheck </div>
            <div style={styles.layout}>
                <div style={styles.leftSide}>
                    <img src="/bisnesman.jpg" alt="Left" style={styles.leftImage} />
                </div>
                <div style={styles.formBox}>
                    <h2 style={styles.title}>Вход</h2>
                    <form onSubmit={handleLogin} style={styles.form}>
                        <input
                            name="username"
                            type="text"
                            placeholder="Имя пользователя"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}

                        />
                        {error && (
                            <div style={{
                                color: "red",
                                marginBottom: "10px",
                                textAlign: "center",
                                fontSize:"30px"

                            }}>
                                {<p1>неверный логин или пароль</p1>}
                            </div>
                        )}
                        <button type="submit" style={styles.button}>Войти</button>
                        <div style={styles.linksContainer}>
                            <a href="/register" style={styles.link}>Зарегистрироваться</a>
                            <a href="/reset-password" style={styles.link}>Восстановить пароль</a>
                        </div>
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
    linksContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '100%'
    },
    link: {
        textDecoration: 'none',
        color: '#66b3ff',
        fontSize: 14
    }
};

export default Login;