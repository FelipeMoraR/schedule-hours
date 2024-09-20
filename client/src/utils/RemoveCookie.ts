
const removeCookie = async () =>{
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const urlCookie = apiUrl + '/auth/api/remove-cookie';

    try{
        const response = await fetch(urlCookie, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result = await response.json();

        if (result.status !== 200){
            console.error('Cookie doesnt exist');
            return false
        }

        return true
        
    } catch (err){
        console.error('There is an error in the response, ', err);
        return false
    }
    

  
}

export default removeCookie;