


const verifyCookie = async () => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const urlCookie = apiUrl + '/auth/api/cookie-protection';

    try{
        const response = await fetch(urlCookie, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const result = await response.json();
        
        if (response.status !== 200){
            console.error('Cookie doest exist');
            return false
        }

        return result.value
    } 
    catch(err: any) {
        console.error('Error =>', err);
        return false
    }
}

export default verifyCookie;