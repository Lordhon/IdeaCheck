import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../axiossettings/axios.jsx";


const ActivateAccount = () => {
    const { uid , token } = useParams();
    const [message , setMessage] = useState('');


    useEffect(() => {
        axios.get(`/user/activate/${uid}/${token}/`).then(res => {
            setMessage('Аккаунт активирован')


        }).catch(err => {
            setMessage('Ссылка устарела');
        });


    }, [uid, token]);
    return (
        <div style={{
            textAlign: 'center',
            backgroundColor: 'black',
            color: 'white',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            <h2>{message}</h2>
        </div>
    );

};
export default ActivateAccount;