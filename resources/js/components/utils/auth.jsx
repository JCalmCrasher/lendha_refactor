function isAuthenticated() {
    if (JSON.parse(localStorage.getItem('user'))) {
        return true;
    } else {
        return false;
    }
}

export const auth = {
    isAuthenticated: isAuthenticated(),
};

export const user = JSON.parse(localStorage.getItem('user'));

export const loginUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    auth.isAuthenticated = true;
};

export const invalidateUser = () => {
    localStorage.removeItem('tok');
    localStorage.removeItem('user');
    auth.isAuthenticated = false;
};

export const logoutUser = () => {
    invalidateUser();
    window.location.assign('/sign-in');
};
