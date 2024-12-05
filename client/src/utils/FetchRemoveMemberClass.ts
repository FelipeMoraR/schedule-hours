
const fetchRemoveMemberClass = async (idUser: string, idClass:string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + `/auth/api/remove-member-class/${idUser}/${idClass}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }, 
            credentials: 'include',
        });

        const result = await response.json();

        return result

    } catch (err){
        console.error('Error fetchRemoveMemberClass ' + err);
        return 
    }
}

export default fetchRemoveMemberClass