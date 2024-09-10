import RegisterForm from "../../components/RegisterForm/RegisterForm";

function RegisterUser() {
    return (
        <div>
            <h1>Bienvenido al Register</h1>
            <p>Este es el Register</p>
            <RegisterForm
                classes= {['clase1']}
            />
        </div>
    )
}

export default RegisterUser;