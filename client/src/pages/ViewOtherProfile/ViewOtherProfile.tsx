import { useParams } from "react-router-dom";
import fetchViewProfileUser from "../../utils/FetchViewProfileUser";
import { useEffect, useState } from "react";
import { IUser } from "../../interfaces/props";
const ViewOtherProfile = () => {
    const { idUser } = useParams<{ idUser: string }>();
    const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
    const [dataProfile, setDataProfile] = useState<IUser>({
        "id_user": 0,
        "username": "",
        "first_name": "",
        "last_name": "",
        "second_last_name": "",
        "run": 0,
        "run_dv": "",
        "description": "",
        "profile_photo": "",
        "age": 0
    });
    const [errorFetch, setErrorFetch] = useState<string>('');

    const handlerFetchViewProfileUser = async (idUser: string) => {
        setIsLoadingProfile(true);
        const result = await fetchViewProfileUser(idUser);

       

        if(result.status !== 200) {
            setIsLoadingProfile(false);
            setErrorFetch('Error en la busqueda del usuario...')
            return
        }
       
        setErrorFetch('');
        setDataProfile(result.data[0]);
        setIsLoadingProfile(false);
    }

    useEffect(() => {
        if(idUser)  handlerFetchViewProfileUser(idUser);
    }, []);

    if(isLoadingProfile) {
        return(
            <h1>Cargando...</h1>
        )
    }

    if(errorFetch != ''){
        return(
            <h1>{errorFetch}</h1>
        )
    }

    return(
        <h1>
            {
                dataProfile ? (
                    <>
                        <p>{dataProfile.id_user}</p>
                        <p>{dataProfile.username}</p>
                        <p>{dataProfile.age}</p>
                        <p>{dataProfile.first_name}</p>
                    </>
                    
                ) : null
            }
        </h1>
    )

}

export default ViewOtherProfile;

