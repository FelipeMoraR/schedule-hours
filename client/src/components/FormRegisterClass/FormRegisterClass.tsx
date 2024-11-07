import {IRegisterClass} from '../../interfaces/props';
import formatClass from '../../utils/FormatClass';
import styles from './FormRegisterClass.module.css';
import fetchCreateClass from '../../utils/FetchCreateClass';
import fetchUploadImg from '../../utils/FetchUploadImgClodify';
import fetchGetAllCategoryClass from '../../utils/FetchGetAllCategoryClass';
import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';
import TextArea from '../TextArea/TextArea';
import convertBase64 from '../../utils/decodeImageBase64';
import { IAllCategoryClass } from '../../interfaces/props';
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

function FormRegisterClass({ classes }: IRegisterClass) {
    const { formatClasses } = formatClass(styles, classes);
    const [formValues, setFormValues] = useState({
        "name": "",
        "description": "",
        "max_members": "",
        "photo": ""
    });
    const [imgUri64, setImgUri64] = useState<string>('');
    const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(true);
    const [allCategoryClass, setAllCategoryClass] = useState<IAllCategoryClass[]>([]);
    const [cateogyClassSelected, setCateogyClassSelected] = useState<Array<string>>([]);
    const { showModal, closeModal, isModalOpen } = useModal();
    const [messageResponse, setMessageResponse] = useState<string>();
    const { addIdError, removeIdError, emptyIdError, hasError } = identifyInputError();
    const [errorForm, setErrorForm] = useState<Array<string>>([]);
    const [errorFormatImg, setErrorFormatImg] = useState('');
    const navigate = useNavigate();



    

    const handleInputOnChange = async (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormValues({
            ...formValues,
            [event.target.id]: event.target.value
        });

        removeIdError(event.target.id); //Implement this on the other form (RegisterForm)

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

    const handleInputOnChangeCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        removeIdError('categories');
        
        if(checked && value){
            setCateogyClassSelected([
                ...cateogyClassSelected,
                value
            ]);
            return
        }

        const arrayClean = cateogyClassSelected.filter((e) => e != value);

        setCateogyClassSelected(arrayClean);
    }

    const handleSubmitRegisterClass = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        
        showModal('loadingForm');

        const errors: string[] = [];
        const addError = (error: string) => errors.push(error);
        const { name, description, max_members, photo } = formValues;

        if(!validateOnlyLetters(name)) {
            addError('Solo se admiten letras en el nombre de la clase');
            addIdError('name'); 
        }

        if(!validateMaxLengthInput(name, 45) || !validateMinLengthInput(name, 1)){
            addError('Largo del texto debe estar entre 1 a 45 caracteres');
            addIdError('name');
        }

        if(validateOnlyLetters(name) && validateMaxLengthInput(name, 45) && validateMinLengthInput(name, 1)) removeIdError('name');

        if(!validateOnlyNumberLetters(description)) {
            addError('Solo se admiten letras y números en la descripción de la clase');
            addIdError('description'); 
        }

        if(!validateMaxLengthInput(description, 255) || !validateMinLengthInput(description, 1)){
            addError('Largo del texto debe estar entre 1 a 255 caracteres');
            addIdError('description');
        }

        if(validateOnlyNumberLetters(description) && validateMaxLengthInput(description, 255) && validateMinLengthInput(description, 1)) removeIdError('description');
        
        if(!validateOnlyNumbers(max_members)){
            addError('Solo se admiten número en el maximo número de participantes');
            addIdError('max_members');
        }

        if(!validateMaxLengthInput(max_members, 2) || !validateMinLengthInput(max_members, 1)){
            addError('Largo maximo del número son 2 digitos');
            addIdError('max_members');
        }

        if(validateOnlyNumbers(max_members) && validateMaxLengthInput(max_members, 2) && validateMinLengthInput(max_members, 1)) removeIdError('max_members');

        if(cateogyClassSelected.length === 0) {
            addError('Debes seleccionar al menos una categoria');
            addIdError('categories');
        } 

        if(cateogyClassSelected.length > 0) removeIdError('categories');

        if(photo === ''){
            addError('Debes agregar una foto para la clase');
            addIdError('photo');
        }

        if(photo !== '') removeIdError('photo');

        if(errors.length > 0){
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

        const bodyUploadImg = JSON.stringify({
            "image": imgUri64
        });
         
        const responseUrlImg = await fetchUploadImg(bodyUploadImg);
        
        if(!responseUrlImg) {
            closeModal(); //Closing loadingForm modal
        
            setMessageResponse(responseUrlImg.message);
            showModal('infoResponse');
            return;
        };
        
        const bodyCreateClass = JSON.stringify({
            "name": formValues["name"],
            "description": formValues["description"], 
            "max_members": formValues["max_members"], 
            "photo": responseUrlImg.message,
            "categories": cateogyClassSelected
        });
        
        const responseCreateClass = await fetchCreateClass(bodyCreateClass);
        
        closeModal(); //Closing loadingForm modal
        
        setMessageResponse(responseCreateClass.message);
        showModal('infoResponse');

        return;
    }

    useEffect(() => {
        const handlerGetAllCategoryClass = async () => {
            const result = await fetchGetAllCategoryClass();
            setIsLoadingCategory(false);
            setAllCategoryClass(result)
        }
        
        handlerGetAllCategoryClass();
    }, []);

    if(isLoadingCategory) {
        return(
            <>
                CARGANDO CATEGORIAS :UUU
            </>
        )
    }



    return (
        <>
            <Modal 
                id = 'loadingForm'
                type = 'loader'
                title = 'loadingForm'
                isOpen = {isModalOpen('loadingForm')}
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

            <form className= {formatClasses} onSubmit={handleSubmitRegisterClass}>
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
                    id = {'name'}
                    label = {'Nombre Clase'}
                    type = {'text'}
                    name = {'name'}
                    required = {true}
                    maxLength={45}
                    value = {formValues.name}
                    classes = {hasError('name') ? ['error-class'] : ['normal-class']} 
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
                    required = {true}
                    classes = {hasError('description') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                <InputField
                    id = {'max_members'}
                    label = {'Maximo numero de participantes'}
                    type = {'text'}
                    name = {'max_members'}
                    maxLength={2}
                    required = {true}
                    value={formValues.max_members}
                    classes = {hasError('max_members') ? ['error-class'] : ['normal-class']}
                    onChange={handleInputOnChange}
                />


                <InputField
                    id = {'photo'}
                    label = {'Foto clase'}
                    type = {'file'}
                    name = {'photo'}
                    required = {true}
                    value={formValues.photo}
                    classes = {hasError('photo') ? ['error-class'] : ['normal-class']}
                    onChange={handleInputOnChange}
                />

                
                {
                    allCategoryClass && allCategoryClass.length > 0 ? (
                        allCategoryClass.map((category) => ( //This structure of map dont need a return because this sintaxis implicity say it
                            <div key={category.id_category}>
                                <InputField
                                id = {category.id_category.toString()}
                                label = {category.name}
                                type = {'checkbox'}
                                name = {'photo'}
                                required = {false}
                                value={category.id_category}
                                classes = {hasError('categories') ? ['error-class'] : ['normal-class']}
                                onChange={handleInputOnChangeCategory}
                                />
                            </div>
                        ))  //Here is the change, this end with a double (), if we use ({}) you have to write the return or this wouldnt work
                    ) : (
                        <p>No hay ninguna categoria</p>
                    )
                }
                <Button
                        id = 'btnRegister'
                        text = 'Registrarse'
                        type = 'submit'
                        classes = {['backgorund-color-blue-violet', 'color-white']}
                    />
            </form>
        </>
    )
}

export default FormRegisterClass;