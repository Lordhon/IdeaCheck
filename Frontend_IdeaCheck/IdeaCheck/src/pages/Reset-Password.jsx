import React, {useEffect, useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/reset_password/", { email });
            setMessage("Инструкции по восстановлению отправлены на ваш email");
            setError("");
        } catch (err) {
            setError(err.response?.data?.detail || "Ошибка при отправке запроса");
            setMessage("");
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
                    <h2 style={styles.title}>Восстановление пароля</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={{ marginBottom: 20, textAlign: 'center' }}>
                            Введите ваш email для восстановления пароля
                        </div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                        {error && (
                            <div style={styles.errorText}>
                                {error}
                            </div>
                        )}
                        {message && (
                            <div style={styles.successText}>
                                {message}
                            </div>
                        )}
                        <button type="submit" style={styles.button}>Отправить</button>
                        <div style={styles.linksContainer}>
                            <a href="/login" style={styles.link}>Вернуться к входу</a>
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
        justifyContent: 'center',
        marginTop: 15,
        width: '100%'
    },
    link: {
        textDecoration: 'none',
        color: '#66b3ff',
        fontSize: 14
    },
    errorText: {
        color: 'red',
        marginBottom: '10px',
        textAlign: 'center',
        fontSize: '14px'
    },
    successText: {
        color: 'green',
        marginBottom: '10px',
        textAlign: 'center',
        fontSize: '14px'
    }
};

export default ResetPassword;