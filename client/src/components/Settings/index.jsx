import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts";

function Settings() {

    const getUserID = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`http://localhost:3000/token/get/${token}`)
        const data = await response.json();

        return data.user_id.toString();
    }

    const { user, setUser } = useAuth();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userId = await getUserID();
                const response = await fetch(`http://localhost:3000/user/${userId}`);
                const userData = await response.json();
                setUser(userData);
                console.log(userData)
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUserData();
    }, [setUser]);

    return (
        <div>
            <h2>Profile Settings</h2>
            {user ? (
                <div>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );

}

export default Settings;