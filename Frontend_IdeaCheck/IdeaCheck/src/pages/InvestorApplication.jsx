import axios from "../axiossettings/axios.jsx";
import { useState } from 'react';
import {useNavigate} from "react-router-dom";

const InvestorApplication = ()=> {
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({about: '', experience: '', project: ''});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
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
                const res = await axios.post(`/investor/applications/`, form);
                setMessage('Заявка отправлена');
            } catch (err) {
                if (err.response?.data?.errors) {
                    setMessage(err.response.data?.error);
                } else {
                    setMessage('Ошибка при отправке');
                }
            }

        }



    };
    const styles = {
        container: {
            backgroundColor: '#000',
            color: 'white',
            padding: '32px',
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box',
        },
        title: {
            fontSize: '38px',
            marginBottom: '32px',
            fontWeight: 'bold',
            color: '#1a73e8',
        },
        form: {
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        fieldContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        label: {
            marginBottom: '5px',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        input: {
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#111',
            color: 'white',
        },
        error: {
            color: '#ff6b6b',
            fontSize: '14px',
            marginTop: '4px',
        },
        button: {
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            padding: '16px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: loading ? 0.6 : 1,
            transition: 'opacity 0.3s',
        },
        message: {
            marginTop: '15px',
            fontSize: '16px',
            textAlign: 'center',
            color: message === 'Заявка отправлена' ? 'lightgreen' : '#ff6b6b',
        },
        backButton: {
            marginTop: '20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '14px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%',
            maxWidth: '600px',
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Отправить заявку инвестора</h1>
            <form onSubmit={handleSubmit} style={styles.form} noValidate>
                <div style={styles.fieldContainer}>
                    <label style={styles.label}>О себе</label>
                    <textarea name="about" value={form.about} onChange={handleChange} placeholder="Введите информацию о себе" style={styles.input} rows={3} autoComplete="off"/>
                    {errors.about && <p style={styles.error}>{errors.about}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Опыт</label>
                    <textarea name="experience" value={form.experience} onChange={handleChange} placeholder="Введите ваш опыт" style={styles.input} rows={2} autoComplete="off"/>
                    {errors.experience && <p style={styles.error}>{errors.experience}</p>}
                </div>

                <div style={styles.fieldContainer}>
                    <label style={styles.label}>Проекты</label>
                    <textarea name="project" value={form.project} onChange={handleChange} placeholder="Введите проекты" style={styles.input} rows={2} autoComplete="off"/>
                    {errors.project && <p style={styles.error}>{errors.project}</p>}
                </div>

                <button type="submit" style={styles.button}>
                    Отправить заявку
                </button>
            </form>

            {message && <p style={styles.message}>{message}</p>}

            <button style={styles.backButton} onClick={() => navigate(-1)}>
                Вернуться
            </button>
        </div>
    );

}
export default InvestorApplication;