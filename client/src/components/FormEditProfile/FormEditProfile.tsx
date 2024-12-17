import { IFormEditProfile } from "../../interfaces/props";
import { useModal } from '../../utils/UseModal.ts';
import Modal from '../Modal/Modal.tsx';
import { 
    validateOnlyNumberLetters, 
    validateOnlyLetters, 
    validateOnlyNumbers, 
    validateMaxLengthInput, 
    validateMinLengthInput,
    identifyInputError
    } from '../../utils/InputValidator.tsx';
import { useNavigate } from 'react-router-dom';
import validateSesion from '../../utils/SesionValidator.ts';
import React, { useState } from 'react';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';
import TextArea from '../TextArea/TextArea';
import convertBase64 from '../../utils/decodeImageBase64';
import fetchUploadImg from "../../utils/FetchUploadImgClodify.ts";
import fetchUpdateUser from "../../utils/FetchUpdateUser.ts";
import { useAuthContext } from "../../hooks/authContext.tsx";

const FormEditProfile = ({id_user, first_name, last_name, second_last_name, description, profile_photo, age}: IFormEditProfile) => {
    const {handleUpdateUser} = useAuthContext();
    const [messageResponse, setMessageResponse] = useState<string>();
    const [errorForm, setErrorForm] = useState<Array<string>>([]);
    const { addIdError, removeIdError, emptyIdError, hasError } = identifyInputError();
    const {showModal, closeModal, isModalOpen} = useModal();
    const [imgUri64, setImgUri64] = useState<string>('');
    const [preViewImg, setPreViewImg] = useState<string | null | ArrayBuffer>();
    const [errorFormatImg, setErrorFormatImg] = useState('');
    const [formValues, setFormValues] = useState({
        "fName" : first_name ? first_name : "",
        "lastname" : last_name ? last_name : "",
        "second_last_name": second_last_name ? second_last_name : "",
        "age" : age ? age.toString() : "",
        "description" : description ? description : "",
        "photo" : ""
    })
    
    const navigate = useNavigate();
    
    const handlePreViewImg = (files: Blob) => {
        const reader = new FileReader(); //What is this?
    
        reader.onload = () => { //Why i have to use this??
            setPreViewImg(reader.result);
        }
    
        reader.onerror = () => {
            setPreViewImg('');
        }
    
        reader.readAsDataURL(files);
    }

    const emptyPhoto = () => {
        setPreViewImg('');
        setFormValues({
            ...formValues,
            ['photo']: ''
        })
    }

    const handleInputOnChange = async (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormValues({
            ...formValues,
            [event.target.id]: event.target.value
        });

        removeIdError(event.target.id); 

        if(!(event.target instanceof HTMLInputElement)) return; //This prevent the access of htmlTextAreaElements elements to the rest of code.

        if(!event.target.files) return;

        const files = event.target.files; //Controll when they try to upload other thing than an image, and it has to be just one
       
        
        if(!files || files.length === 0) return;

        const fileSizeMb = files[0].size / (1024 * 1024);

        if(fileSizeMb > 9.5){
            setErrorFormatImg('Mi loco la imagen pesa mucho, debe ser inferior a 9.5mb');
            addIdError('photo');
            setFormValues({
                ...formValues,
                ['photo']: ''
            });
            return
        }

        if(files[0].type.startsWith('image/')){
            const imgBs64 = await convertBase64(files[0]);
            
            if(typeof(imgBs64) !== 'string') return
            
            handlePreViewImg(files[0]);

            setImgUri64(imgBs64);
            removeIdError('photo');
            setErrorFormatImg('');
            return
        }

        setErrorFormatImg('Formato no aceptado, debe ser una imagen');
        addIdError('photo');
        setFormValues({
            ...formValues,
            ['photo']: ''
        });
        
        return;
    }

    const handleSubmitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const { fName, lastname, second_last_name, age, description, photo } = formValues;
    
            const errors: string[] = [];
            const addError = (error: string) => errors.push(error);
    
            showModal('loadingRegister');
    
            if(!validateOnlyLetters(fName)){
                addError('Solo se admiten letras en el primer nombre');
                addIdError('fName'); 
            }
    
            if(!validateMaxLengthInput(fName, 20)){
                addError('Largo maximo para el primer nombre son 20 caracteres');
                addIdError('fName');
            }
    
            if(!validateMinLengthInput(fName, 4)){
                addError('Largo minimo para el primer nombre son 4 caracteres');
                addIdError('fName');
            }
    
            if(validateOnlyLetters(fName) && validateMaxLengthInput(fName, 20) && validateMinLengthInput(fName, 4)) removeIdError('fName');
            
    
            if(!validateOnlyLetters(lastname)){
                addError('Solo se admiten letras en el apellido paterno');
                addIdError('lastname');
            }
            
            if(!validateMaxLengthInput(lastname, 20)){
                addError('Largo maximo para el apellido son 20 caracteres');
                addIdError('lastname');
            }
            
            if(!validateMinLengthInput(lastname, 4)){
                addError('Largo minimo para el apellido paterno son 4 caracteres');
                addIdError('lastname');
            }
    
            if(validateOnlyLetters(lastname) && validateMaxLengthInput(lastname, 20) && validateMinLengthInput(lastname, 4)) removeIdError('lastname');


            if(!validateMaxLengthInput(second_last_name, 20)){
                addError('Largo maximo para el segundo apellido son 20 caracteres');
                addIdError('second_last_name');
            }
            
            if(!validateMinLengthInput(second_last_name, 4)){
                addError('Largo minimo para el segundo apellido son 4 caracteres');
                addIdError('second_last_name');
            }
    
            if(validateOnlyLetters(second_last_name) && validateMaxLengthInput(second_last_name, 20) && validateMinLengthInput(second_last_name, 4)) removeIdError('second_last_name');
    
            if(!validateOnlyNumbers(age)){
                addError('La edad solo deben ser números');
                addIdError('age');
            }
    
            if(!validateMaxLengthInput(age, 3)){
                addError('Largo maximo para la edad son 3 números');
                addIdError('age');
            }
    
            if(!validateMinLengthInput(age, 1)){
                addError('Largo minimo para la edad es 1 número');
                addIdError('age');
            }
            
            if(validateOnlyNumbers(age) && validateMaxLengthInput(age, 3) && validateMinLengthInput(age, 1)) removeIdError('age');
    
            if(!validateOnlyNumberLetters(description)) {
                addError('Solo se admiten letras y números en la descripción de la clase');
                addIdError('description'); 
            }
            
            if(!validateMaxLengthInput(description, 255) || !validateMinLengthInput(description, 1)){
                addError('Largo del texto debe estar entre 1 a 255 caracteres');
                addIdError('description');
            }
            
            if(validateOnlyNumberLetters(description) && validateMaxLengthInput(description, 255) && validateMinLengthInput(description, 1)) removeIdError('description');
    
            
            if(photo === '' && !profile_photo){
                addError('Debes agregar una foto para tu perfil');
                addIdError('photo');
            }
    
            if(photo !== '') removeIdError('photo');


            if(errors.length > 0) {
                setErrorForm(errors);
                closeModal();
                return
            }
    
            emptyIdError();
            setErrorForm([]);
    
            const statusSesion = await validateSesion();

            if(!statusSesion){
                closeModal(); //Closing loadingForm modal

                setMessageResponse('Sesion caducada');
                showModal('infoResponse');

                await new Promise(resolve => setTimeout(resolve, 1000));

                navigate('/login-user');
                return
            }


            //Please review this, is horrible how it written
            let objBodyRegister;
            let responseUrlImg;

            if(imgUri64){
                const bodyUploadImg = JSON.stringify({
                    "image": imgUri64
                });
                
                responseUrlImg = await fetchUploadImg(bodyUploadImg);
                
                console.log('result img =>', responseUrlImg);

                if(!responseUrlImg) {
                    closeModal(); //Closing loadingForm modal
    
                    setMessageResponse(responseUrlImg.message);
                    showModal('infoResponse');
                    return;
                };
    
                objBodyRegister = JSON.stringify({
                    "idUser" : id_user,
                    "fName" : fName,
                    "lastname" : lastname,
                    "second_last_name": second_last_name,
                    "photo": responseUrlImg.message, 
                    "age" : age ,
                    "description" : description,
                });
            } else {
                objBodyRegister = JSON.stringify({
                    "idUser" : id_user,
                    "fName" : fName,
                    "lastname" : lastname,
                    "second_last_name": second_last_name,
                    "photo": profile_photo, 
                    "age" : age ,
                    "description" : description,
                });
            }
            
            const responseUpdateUser = await fetchUpdateUser(objBodyRegister);
            
            if(responseUpdateUser.status == 200) {
                if(responseUrlImg.message){
                    handleUpdateUser(fName, lastname, second_last_name, responseUrlImg.message, age, description);
                } else {
                    handleUpdateUser(fName, lastname, second_last_name, profile_photo, age, description);
                }
                
               
            }

            closeModal(); //Closing loadingForm modal
        
            setMessageResponse(responseUpdateUser.message);
            showModal('infoResponse');
        }
    
    return (
        <>
            <Modal
                id = 'loadingRegister'
                type = 'loader'
                title = 'Loading...'
                isOpen = {isModalOpen('loadingRegister')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />


            <Modal 
                id = 'infoResponse'
                type = 'informative'
                title = 'Result'
                paragraph = {messageResponse}
                isOpen = {isModalOpen('infoResponse')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />

            <form onSubmit={handleSubmitRegister}>
                {
                    errorForm.length !== 0 ? (
                        <div className='error'>
                            {errorForm.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    ) : null
                }

                {
                    errorFormatImg !== '' ? (
                        <div className='error'>
                            <p>{errorFormatImg}</p>
                        </div>
                    ) : null
                }
            

                <InputField
                    id = {'fName'}
                    label = {'Primer nombre'}
                    type = {'text'}
                    name = {'fName'}
                    required = {true}
                    maxLength={45}
                    value = {formValues.fName}
                    classes = {hasError('fName') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                <InputField
                    id = {'lastname'}
                    label = {'Apellido'}
                    type = {'text'}
                    name = {'lastname'}
                    required = {true}
                    maxLength={45}
                    value = {formValues.lastname}
                    classes = {hasError('lastname') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                <InputField
                    id = {'second_last_name'}
                    label = {'Segundo apellido'}
                    type = {'text'}
                    name = {'second_last_name'}
                    required = {true}
                    maxLength={45}
                    value = {formValues.second_last_name}
                    classes = {hasError('second_last_name') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                <InputField
                    id = 'age'
                    label = 'Inserte su edad'
                    type = 'text'
                    name = 'age'
                    required = {true}
                    value={formValues.age}
                    maxLength={3}
                    classes={hasError('age') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                <TextArea
                    id = {'description'}
                    label = {'Descripcion'}
                    name = {'description'}
                    placeholder = {'Descripcion'}
                    maxlength = {250} 
                    rows = {5}
                    cols = {20}
                    value={formValues.description}
                    required = {true}
                    classes = {hasError('description') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                
                <InputField
                    id = {'photo'}
                    label = {'Foto'}
                    type = {'file'}
                    name = {'photo'}
                    required = {false}
                    value={formValues.photo}
                    classes = {hasError('photo') ? ['error-class'] : ['normal-class']}
                    onChange={handleInputOnChange}
                />

                {
                    preViewImg && !(preViewImg instanceof ArrayBuffer) ? (
                        <>
                            <img src={preViewImg} alt="prevImgClass" />

                            <Button
                                id = 'clearPhoto'
                                text = 'Limpiar foto'
                                classes = {['']}
                                type = 'button'
                                onClick = {emptyPhoto}
                            />
                        </>
                    ) : (
                        profile_photo ? (
                            <img src={profile_photo} alt="imgProfile" />
                        ) : (
                            <h1>no hay img seleccionada ni img previa</h1>
                        )
                        
                    )
                }


                <Button
                        id = 'btnUploadUser'
                        text = 'Actualizar'
                        type = 'submit'
                        classes = {['backgorund-color-blue-violet', 'color-white']}
                />
            </form>


        </>
    )
}


export default FormEditProfile; 