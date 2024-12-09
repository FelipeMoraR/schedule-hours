
const fetchAcceptEnrollStudentClass = async (body: string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/accept-enroll-student';

        const response = await fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: body
        });

        const result = await response.json();

        return result

    } catch (err){
        console.error('Something went wrong fetchEnrollStudentClass::: ' + err);
        return
    }
}

export default fetchAcceptEnrollStudentClass;