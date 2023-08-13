import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts";
import "./styles.css";

function Settings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editedUser, setEditedUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
    });

    const getUserID = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`http://localhost:3000/token/get/${token}`);
        const data = await response.json();

        return data.user_id.toString();
    };

    const { user: authUser } = useAuth();

    useEffect(() => {
        console.log("Inside useEffect!");

        const loadUserData = async () => {
            try {
                if (authUser) {
                    console.log("User:", authUser);
                    setUser(authUser);
                    setEditedUser({
                        firstName: authUser.firstName,
                        lastName: authUser.lastName,
                        email: authUser.email,
                        username: authUser.username,
                    });
                    setLoading(false);
                } else {
                    const userId = await getUserID();
                    const response = await fetch(`http://localhost:3000/user/${userId}`);
                    const userData = await response.json();

                    console.log("Fetched User Data:", userData);

                    setUser(userData);
                    setEditedUser({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        username: userData.username,
                    });
                    console.log("Do we reach here?");
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                setLoading(false);
            }
        };

        loadUserData();
    }, [authUser]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userId = await getUserID();
            const response = await fetch(`http://localhost:3000/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedUser),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log("User updated:", updatedUser);
                setUser(updatedUser);
            } else {
                console.error('Error updating user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div className="settings-container">
            <h2>Profile Settings</h2>
            {loading ? (
                <p>Loading user data...</p>
            ) : user ? (
                <form className="settings-form" onSubmit={handleSubmit}>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={editedUser.firstName}
                            onChange={handleEditChange}
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={editedUser.lastName}
                            onChange={handleEditChange}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleEditChange}
                        />
                    </div>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={editedUser.username}
                            onChange={handleEditChange}
                        />
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <p>User data not available.</p>
            )}
        </div>
    );
}

export default Settings;
