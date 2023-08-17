import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { useAuth } from "../../contexts";
import { useNavigate } from "react-router-dom";

// import "./styles.css";


function Settings() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editedUser, setEditedUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: ""
    });
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");

    const getUserID = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`http://localhost:3000/token/get/${token}`);
        const data = await response.json();

        return data.user_id.toString();
    };

    const { user: authUser } = useAuth();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                if (authUser) {
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

                    setUser(userData);
                    setEditedUser({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        username: userData.username,
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                setLoading(false);
            }
        };

        loadUserData();
    }, [authUser]);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
        if (name === "email" && !validateEmail(value)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        try {
            const userId = await getUserID();
            const updateUserPayload = {
                ...editedUser,
                ...(newPassword && { password: await bcrypt.hash(newPassword, 10) }),
            };

            const response = await fetch(`http://localhost:3000/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateUserPayload),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log("User updated:", updatedUser);
                setUser(updatedUser);
                alert('Changes saved successfully!');

            } else {
                console.error('Error updating user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            try {
                const userId = await getUserID();
                const response = await fetch(`http://localhost:3000/user/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('You successfully deleted your account!');
                    localStorage.clear();
                    navigate("/signup");

                } else {
                    console.error('Error deleting user:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };



    return (
        <div data-testid="settings-container" className="settings-container">
            <h1>Account Settings</h1>
            <h2>Welcome, {String(editedUser.firstName.charAt(0).toUpperCase()) + String(editedUser.firstName.slice(1))}!</h2>
            {loading ? (
                <p>Loading user data...</p>
            ) : user ? (
                <form className="settings-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"  // Add an ID to the form control
                            name="firstName"
                            value={editedUser.firstName}
                            onChange={handleEditChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"  // Add an ID to the form control
                            name="lastName"
                            value={editedUser.lastName}
                            onChange={handleEditChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"  // Add an ID to the form control
                            name="email"
                            value={editedUser.email}
                            onChange={handleEditChange}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"  // Add an ID to the form control
                            name="username"
                            value={editedUser.username}
                            onChange={handleEditChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"  // Add an ID to the form control
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"  // Add an ID to the form control
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={handleDeleteAccount} className="delete-button">
                        Delete Account
                    </button>
                </form>
            ) : (
                <p>User data not available.</p>
            )}
        </div>
    );
}

export default Settings;
