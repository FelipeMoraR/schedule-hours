
function handlerNavigationNavBar(id:string, navigate: (path: string) => void) {
    
    switch (id){
        case 'loginUser':
            navigate('/login-user');
            return;
        case 'registerUser':
            navigate('/register-user');
            return;
        case 'profileUser':
            navigate('/profile-user');
            return;
        case 'home':
            navigate('/');
            return;
        case 'createClass':
            navigate('/create-class');
            return;
        default:
            navigate('/');
            return;
    }
}

export default handlerNavigationNavBar;