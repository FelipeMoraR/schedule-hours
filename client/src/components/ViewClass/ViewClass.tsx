import { IViewClass } from "../../interfaces/props";
import Button from "../Button/Button";
import ClassEditable from "./ClassEditable";
import ClassNotEditable from "./ClassNotEditable";




const ViewClass = ({id_class, class_name, description, max_number_member, photo, status_name, type_user, isEditable, categories, handleBack, deleteClass, modifyClass} : IViewClass) => {
    
    if(!isEditable){
        return(
            <>
                <Button
                    id = 'goBackAllClasses'
                    text = 'Volver'
                    type = 'buttom'
                    classes = {['clase']}
                    onClick = {handleBack}
                />

                <ClassNotEditable
                    id_class = {id_class}
                    class_name = {class_name}
                    description = {description}
                    max_number_member = {max_number_member}
                    photo = {photo}
                    status_name = {status_name}
                    type_user = {type_user}
                    categories = {categories}
                />
            </>
        )
    }

    return(
        <>
            <Button
                id = 'goBackAllClasses'
                text = 'Volver'
                type = 'buttom'
                classes = {['clase']}
                onClick = {handleBack}
            />

            <ClassEditable
                id_class = {id_class}
                class_name = {class_name}
                description = {description}
                max_number_member = {max_number_member}
                photo = {photo}
                status_name = {status_name}
                type_user = {type_user}
                deleteClass = {deleteClass}
                modifyClass = {modifyClass}
                categories = {categories}
            />
        </>
    )
};

export default ViewClass;