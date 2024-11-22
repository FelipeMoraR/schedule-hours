const fetchGetAllMembersClass = async (id: string) =>{
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + `/auth/api/members-class/?idClass=${id}`

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


export default fetchGetAllMembersClass;