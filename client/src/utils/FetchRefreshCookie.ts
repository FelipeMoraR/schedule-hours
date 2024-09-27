const fetchRefreshToken = async () => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/refresh-token';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    
        const result = await response.json();
    
        if(result.status !== 200){
            console.error(result.message);
            return false
        }

        return true

    } catch (err){
        console.error('Somethin went wrong refreshin token' + err);
        return false
    }
}

export default fetchRefreshToken;