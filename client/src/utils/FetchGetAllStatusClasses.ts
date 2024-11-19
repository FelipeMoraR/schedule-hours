
const fetchGetAllStatusClasses = async () =>{
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/all-status-class'

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const result = await response.json();

        if(result.status !== 200) return false;

        return result.data;
    }
    catch(err){
        console.error('Error in the petition :' + err);
        return false;
    }
}


export default fetchGetAllStatusClasses;