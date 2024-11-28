import { IClass } from "../../interfaces/props";



const ClassNotEditable = ({ id_class, class_name, description, max_number_member, photo, status_name, type_user, categories, members, time_class, date_class } : IClass) => {
    return (
        <>
            <h1>VISTA INTERNA clase normal, esta es su id = {id_class} </h1>
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
                            <div key={member.id_type_class_user}>
                                {index + 1} - {member.username}
                            </div>
                        ))
                    ) : (
                        <h2>No hay miembros</h2>
                    )
                }

                {
                    type_user == 2  && status_name == 'open' ? (
                        <div>
                            <button>Unirme</button>
                        </div>
                    ) : null
                }
        </>
    )
}   

export default ClassNotEditable;