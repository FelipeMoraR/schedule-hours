

const fetchDeleteClass = async (idClass: string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/delete-class/' + idClass;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const result = await response.json();

        if(result.status !== 200){
            return false;
        }

        return true

    }
    catch(err){
        console.error('Something went wrong' + err);
        return false
    }
}

export default fetchDeleteClass;