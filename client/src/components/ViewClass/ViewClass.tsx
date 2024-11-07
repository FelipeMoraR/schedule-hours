import { IViewClass } from "../../interfaces/props";

const ViewClass = ({id_class, class_name, description, max_number_member, photo, status_name} : IViewClass) => {

    return(
        <>
            <h1>VISTA INTERNA</h1>
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

            <button>Unirse a la clase, esta es tu id = {id_class}</button>
        </>
    )
};

export default ViewClass;