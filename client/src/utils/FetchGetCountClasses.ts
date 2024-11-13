const fetchGetCountClasses = async (idUser : string = '') => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        
        const url = apiUrl + `/auth/api/all-counted-classes?idUser=${idUser}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const result = await response.json();

        return result;

    } 
    catch(err){
        console.error('Error get all classes ' + err);
        return {status: 500, message: 'Error ' + err};
    }
}


export default fetchGetCountClasses;