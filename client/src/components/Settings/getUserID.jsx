export const getUserID = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`http://localhost:3000/token/get/${token}`);
    const data = await response.json();

    return data.user_id.toString();
};