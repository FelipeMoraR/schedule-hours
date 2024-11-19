import { useEffect, useState } from "react";
import { IClass } from "../../interfaces/props";
import Button from "../Button/Button";
import InputField from '../InputField/InputField';
import TextArea from '../TextArea/TextArea';
import convertBase64 from "../../utils/decodeImageBase64";
import Select from "../Select/Select";

const ClassEditable = ({ id_class, class_name, description, max_number_member, photo, status_name, type_user, categories, allCategories, allStatus, deleteClass } : IClass) => {

    const id_status_filtered = allStatus?.filter(status => status.name === status_name ).map(status => status.id_status)[0]; //Remember, if you just use one '=' this repleace all name of the obj.

    const id_category_filtered = categories?.map(cat => cat.id_category.toString());
    
    const [formValues, setFormValues] = useState({
        "name": class_name,
        "description": description,
        "max_members": max_number_member,
        "photo": "", //This take the name of the file, not the img.
        "id_status": id_status_filtered,
    });
    const [categorySelected, setCategoryClassSelected] = useState<Array<string>>(id_category_filtered);
    const [preViewImg, setPreViewImg] = useState<string | null | ArrayBuffer>(photo); //What is an ArrayBuffer?
    const [imgUri64, setImgUri64] = useState<string>('');

    //We have to add error controll
    const handlePreViewImg = (files: Blob) => {
        const reader = new FileReader(); //What is this?

            reader.onload = () => { //Why i have to use this??
                setPreViewImg(reader.result);
            }

            reader.onerror = () => {
                setPreViewImg(photo);
            }

            reader.readAsDataURL(files);
    }

    const handleInputOnChange = async (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setFormValues({
            ...formValues,
            [event.target.id]: event.target.value
        });

        //removeIdError(event.target.id); //Implement this on the other form (RegisterForm)

        if(!(event.target instanceof HTMLInputElement)) return; //This prevent the access of htmlTextAreaElements elements to the rest of code.

        if(!event.target.files) return;

        const files = event.target.files; //Controll when they try to upload other thing than an image, and it has to be just one
       
        
        if(!files || files.length === 0) return;

        const fileSizeMb = files[0].size / (1024 * 1024);

        if(fileSizeMb > 9.5){
            //setErrorFormatImg('Mi loco la imagen pesa mucho, debe ser inferior a 9.5mb');
            //addIdError('photo');
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
            //removeIdError('photo');
            //setErrorFormatImg('');
            return
        }

        //setErrorFormatImg('Formato no aceptado, debe ser una imagen');
        //addIdError('photo');
        setFormValues({
            ...formValues,
            ['photo']: ''
        });
        
        return;
    }

    const handleInputOnChangeCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        //removeIdError('categories');

        if(checked && value){
            setCategoryClassSelected([
                ...categorySelected,
                value
            ]);
            return
        }

        const arrayClean = categorySelected.filter((e) => e != value);

        setCategoryClassSelected(arrayClean);
    }

    const handleSubmitEditClass = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


    }

    return (
        <>
            <form onSubmit={handleSubmitEditClass}>
                <InputField
                    id = {'name'}
                    label = {'Nombre Clase'}
                    type = {'text'}
                    name = {'name'}
                    required = {true}
                    maxLength={45}
                    value = {formValues.name}
                    //classes = {hasError('name') ? ['error-class'] : ['normal-class']} 
                    classes={['']}
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
                    value = {formValues.description}
                    required = {true}
                    //classes = {hasError('description') ? ['error-class'] : ['normal-class']} 
                    classes = {['sdfklpg']}
                    onChange={handleInputOnChange}
                />
                <InputField
                    id = {'max_members'}
                    label = {'Numero maximo miembros'}
                    type = {'text'}
                    name = {'max_members'}
                    required = {true}
                    maxLength={45}
                    value = {formValues.max_members}
                    //classes = {hasError('name') ? ['error-class'] : ['normal-class']} 
                    classes={['']}
                    onChange={handleInputOnChange}
                />


                <InputField
                    id = {'photo'}
                    label = {'Foto clase'}
                    type = {'file'}
                    name = {'photo'}
                    required = {true}
                    value={formValues.photo}
                    //classes = {hasError('photo') ? ['error-class'] : ['normal-class']}
                    classes = {['']}
                    onChange={handleInputOnChange}
                />

                <img src = {preViewImg} alt="jeje" />


                <Select
                    id = 'id_status'
                    name = 'id_status'
                    values = {allStatus ? (allStatus): ([])}
                    keyValue = "id_status"
                    keyName = "name"
                    onChange = {handleInputOnChange}
                    selectedValue = {formValues.id_status}
                />


                {
                    allCategories && allCategories.length > 0 ? (
                        allCategories.map((cat) => ( //This structure of map dont need a return because this sintaxis implicity say it
                            <div key={cat.id_category}>
                                <InputField
                                id = {cat.id_category.toString()}
                                label = {cat.name}
                                type = {'checkbox'}
                                name = {'categories'}
                                required = {false}
                                value={cat.id_category}
                                //classes = {hasError('categories') ? ['error-class'] : ['normal-class']}
                                classes={['lol']}
                                onChange={handleInputOnChangeCategory}
                                checked = {categorySelected.includes(cat.id_category.toString())}
                                />
                            </div>
                        ))  //Here is the change, this end with a double (), if we use ({}) you have to write the return or this wouldnt work
                    ) : (
                        <p>No hay ninguna categoria</p>
                    )
                }
            </form>
                           
            {
                type_user != 2 && deleteClass ? (
                    <div>
                        <Button
                            id = 'deleteClass'
                            text = 'Eliminar clase'
                            type = 'buttom'
                            classes = {['btn-delete']}
                            onClick = {() => {
                                deleteClass(id_class);
                            }}
                        />

                    </div>
                ) : null
            }

        </>
    )
}   

export default ClassEditable;