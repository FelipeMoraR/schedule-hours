
const fetchUpdateClass = async (body: string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + `/auth/api/upload-class`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            credentials: 'include',
            body: body
        });

        const result = await response.json();

        return result
    }
    catch(err){
        console.error('Something went wrong: ' + err);
        return 
    }
}

export default fetchUpdateClass;