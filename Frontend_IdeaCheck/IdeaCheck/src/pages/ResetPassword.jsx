import {  useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../axiossettings/axios.jsx";


const NewPassword = () => {
    const {uid , token} = useParams();
    const [password, setPassword] = useState('');
    const [message, setMassage] = useState('');


    const handleSubmit = async  e => {
        e.preventDefault()

        try {
            await axios.post(`/user/reset_password/${uid}/${token}/`,  {password})
            setMassage('Пароль успешно изменён');
        }catch(err) {
            setMassage('Ошибка: ' + err.response?.data?.error || 'что-то пошло не так');
        }
    };
    return (
        <div style={{ padding: 20 }}>
            <h2>Сброс пароля</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Новый пароль" required />
                <button type="submit">Сменить пароль</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default NewPassword;
