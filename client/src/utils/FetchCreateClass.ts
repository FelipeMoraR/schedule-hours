

const fetchCreateClass = async (body: string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + 'auth/api/create-class';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', //Extract cookie credentials
            body: body
        });

        const result = await response.json();

        if (result.status != 200) return false;

        return result
        
    }
    catch (e) {
        console.error('Something went wrong' + e);
        return false;
    }

}


export default fetchCreateClass;