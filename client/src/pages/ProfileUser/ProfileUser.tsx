import styles from './ProfileUser.module.css';
import ViewOurProfile from '../../components/viewProfile/viewOurProfile';
import { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import { useAuthContext } from '../../hooks/authContext';

function ProfileUser() {
    const [isForm, setIsForm] = useState<number>(0);
    const {userData} = useAuthContext();

    const handlerTypeViewForm = () => {
        if(isForm == 0) {
            setIsForm(1);
            return
        }

        setIsForm(0);
        return
    }

    useEffect(() => {
        console.log(userData)
    }, [])

    return (
        <div className= {styles.container}>
            <h1>Bienvenido al una tu perfil :U</h1>
            <p>Este es el Perfil</p>
            <ViewOurProfile 
                id_user = {userData.id_user}
                username = {userData.username}
                first_name = {userData.first_name}
                last_name = {userData.last_name}
                second_last_name = {userData.second_last_name}
                run = {userData.run}
                run_dv = {userData.run_dv}
                description = {userData.description}
                profile_photo = {userData.profile_photo}
                age = {userData.age}
                typeView = {isForm}
            />

            <Button 
                id  = {'handlerViewForm'}
                text  = {'Modificar Datos'}
                type  = {'buttom'}
                classes  = {['']}
                onClick  = {handlerTypeViewForm}
            />
        </div>
    )
}

export default ProfileUser;