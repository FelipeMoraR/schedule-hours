import { IClass } from "../../interfaces/props";
import fetchEnrollStudentClass from "../../utils/FetchEnrollStudentClass";
import { useAuthContext } from "../../hooks/authContext";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { useModal } from "../../utils/UseModal";
import { useState } from "react";

const ClassNotEditable = ({ id_class, class_name, description, max_number_member, photo, status_name, type_user, categories, members, time_class, date_class, handleAddNewMember } : IClass) => {
    
    const {userData} = useAuthContext();
    const idUser = userData.id_user;
    const { closeModal, isModalOpen, showModal } = useModal();
    const [msjResponse, setMsjResponse] = useState<string>();
    const [isLoadingEnroll, setIsLoadingEnroll] = useState<boolean>(false);


    const handleEnrollStudentClass = async () => {
        setIsLoadingEnroll(true);
    
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const body = JSON.stringify({
            "idUser" : idUser,
            "idClass": id_class
        });

        const memberSesion = {
            "id_user": userData.id_user,
            "username": userData.username,
            "id_type_class_user": 2,
            "id_status_class_user": 2
        }

        const result = await fetchEnrollStudentClass(body);

        if (result.data.classIsFull) {
            setMsjResponse('Clase llena');
            setIsLoadingEnroll(false);
        }

        if (result.data.userInserted == 0 && result.data.userExistInClass == 1){
            setMsjResponse('Ya estas en la clase');
            setIsLoadingEnroll(false);
        }

        if (result.data.userInserted == 1 && result.data.userExistInClass == 0){
            setMsjResponse('Haz ingresado a la clase!');
            if(handleAddNewMember) handleAddNewMember(memberSesion);
            setIsLoadingEnroll(false);
        }

        showModal('response');

        return
    }
        
    return (
        <>

            <Modal 
                id = 'loadingEnroll'
                type = 'loader'
                title = 'Uniendo...'
                isOpen = {isLoadingEnroll}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />

            <Modal
                id = "response"
                type = "informative"
                classes = {['modal-infomative-grey']}
                isOpen = {isModalOpen("response")}
                onClose = {closeModal}
                title = "Result"
                paragraph = {msjResponse}
            />

            <h1> Id clase = {id_class} </h1>
                <div>
                    <h2>Clase: {class_name}</h2>
                    <h3>{max_number_member}</h3>
                </div>

            
                <div>
                    <h4>{status_name}</h4>
                </div>

                <div>
                    <p>{description}</p>
                    <img src={photo} alt={class_name} />
                </div>
                
                <div>
                    {
                        date_class && time_class ? (
                            <p>Fecha: {date_class} - {time_class}</p>
                        ) : (
                            <p>No tiene fecha</p>
                        )
                    }
        
                </div>

                {
                    categories.map(el => (
                        <div key={el.id_category}>
                            {el.category_name}
                        </div>
                    ))
                }

                <h1>Miembros</h1>
                {
                    members && members.length > 0 ? (
                        members.map((member, index) => (
                            <div key={member.id_user}>
                                {index + 1} - {member.username} - {member.id_type_class_user == 1 ? 'Dueño' : ''} - {member.id_status_class_user == 1 ? 'Enrolado' : 'Pendiente...'}
                            </div>
                        ))
                    ) : (
                        <h2>No hay miembros</h2>
                    )
                }

                {
                    type_user == 2  && status_name == 'open' && !members?.some(el => el.username.includes(userData.username)) ? (
                        <div>
                            <Button 
                                id = "joinStudent"
                                text = "Unirme"
                                type= "buttom"
                                classes = {['']}
                                onClick = {handleEnrollStudentClass}
                            />
                        </div>
                    ) : null
                }
        </>
    )
}   

export default ClassNotEditable;