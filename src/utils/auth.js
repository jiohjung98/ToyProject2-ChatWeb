export default function getLoggedInUserInfo() {
    const userId = sessionStorage.getItem('userId');

    if (userId) {
        return { id: userId, name: 'Test User', picture: 'test.jpg' };
    }

    return null;
}