import { IViewClass, IMember } from "../../interfaces/props";
import Button from "../Button/Button";
import ClassEditable from "./ClassEditable";
import ClassNotEditable from "./ClassNotEditable";
import fetchGetAllMembersClass from "../../utils/FetchGetAllMembers";
import { useEffect, useState } from "react";



const ViewClass = ({id_class, class_name, description, max_number_member, photo, status_name, type_user, isEditable, categories, allCategories, allStatus, handleBack, deleteClass, time_class, date_class, handleCancellClass} : IViewClass) => {
    const [membersClass, setMembersClass] = useState<Array<IMember>>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState<boolean>(true);

    const handleGetMembers = async () => {
        const result = await fetchGetAllMembersClass(id_class.toString());
        
        if(!result) {
            setIsLoadingMembers(false);
            return
        }
       
        setMembersClass(result);
        setIsLoadingMembers(false);
    }

    const handleRemoveMember = (idUser: number) => {
        setMembersClass(membersClass.filter(member => member.id_user != idUser))
    }

    const handleAddNewMember = (member: IMember) => {
        setMembersClass([
            ...membersClass,
            member
        ])
    }

    const handleUploadMember = (idUser: number) => {
        const memebersFilter = membersClass.filter(member => member.id_user != idUser);
        const memberToUpload = membersClass.filter(member => member.id_user == idUser);


        
    }

   

    useEffect(() => {
        handleGetMembers();
    }, []);

    if(isLoadingMembers){
        return(
            <h1>Loading members</h1>
        )
    }
    

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
                    members = {membersClass}
                    time_class = {time_class}
                    date_class = {date_class}
                    handleAddNewMember = {handleAddNewMember}
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
                deleteClass = {deleteClass}
                categories = {categories}
                allCategories = {allCategories}
                allStatus = {allStatus}
                members={membersClass}
                time_class = {time_class}
                date_class = {date_class}
                handleCancellClass = {handleCancellClass}
                handleRemoveMember = {handleRemoveMember}
            />
        </>
    )
};

export default ViewClass;