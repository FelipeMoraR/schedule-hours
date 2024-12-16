import { IProfile } from "../../interfaces/props"
import FormEditProfile from "../FormEditProfile/FormEditProfile"

const ViewOurProfile = ({id_user, username, first_name, last_name, second_last_name, run, run_dv, description, profile_photo, age, typeView}: IProfile) => {

    if(typeView == 1){
        return (
            <>
                <FormEditProfile
                    id_user = {id_user}
                    first_name = {first_name}
                    last_name = {last_name}
                    second_last_name = {second_last_name}
                    description = {description}
                    profile_photo = {profile_photo}
                    age = {age}
                />
            </>
        )
    }

    return (
        <>  
            <h1>Here we have to put the form to upload your profile jeje</h1>
            <p>id = {id_user}</p>
            <p>usuario = {username}</p>
            <p> primer nombre = {first_name}</p>
            <p> apellido = {last_name}</p>
            <p>segundo apellido = {second_last_name ? (second_last_name) : 'no second_last_name '}</p>
            <p>run = {run}</p>
            <p>dv run = {run_dv}</p>
            <p>Descripción = {description ? (description) : 'no description'}</p>
            <p>img = {profile_photo ? (profile_photo) : 'no img'}</p>
            <p>edad = {age}</p>
        </>
    )
}

export default ViewOurProfile