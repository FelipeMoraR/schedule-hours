const fetchVerifyToken = async () => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/verify-cookie';
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        const data = await response.json(); // Here extract the body of the response
        
        if(data.status === 404){
            console.error('Error in the response', data.message);
            return null
        }

        if (data.status !== 200){
            console.error('Error in the response', data.message);
            return false
        }
        
        return true
    }
    catch(err: any){
        console.error(err);
        return false
    }
}


export default fetchVerifyToken;