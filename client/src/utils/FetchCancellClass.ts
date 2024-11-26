
const fetchCancellClass = async (body: string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/cancell-class';

        const response = await fetch(url, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: body
        });

        const result = await response.json();

        if(result.status !== 200) return false
        
        
        return result;
    }
    catch(err){
        console.error('Error fetchCancellClass ' + err);
        return false
    }
}



export default fetchCancellClass; 