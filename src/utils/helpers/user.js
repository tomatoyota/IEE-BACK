export default {
    getUsername() {
        const username = localStorage.getItem('cieebo-admin-user');

        if (username) {
            return JSON.parse(username).backendUserId
        }
    },
    getUserLastTimeLogin() {
        const username = localStorage.getItem('cieebo-admin-user');

        if (username) {
            return JSON.parse(username).lastTimeLogin
        }
    },
    getUserProfile() {
        const profile = localStorage.getItem('user-profile');
        console.log('profile', profile)
        return profile ? JSON.parse(profile) : null; 
      },
}