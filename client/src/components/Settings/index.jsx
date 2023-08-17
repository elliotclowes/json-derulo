import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { useAuth } from "../../contexts";
import { useNavigate } from "react-router-dom";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import axios from "axios";

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

	const [selectedImage, setSelectedImage] = useState(null);
  	const [uploadProgress, setUploadProgress] = useState(0);
	const [imageUrl, setImageUrl] = useState(null)

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

	const handleImageChange = (event) => {
		const selectedFile = event.target.files[0];
		setSelectedImage(selectedFile);
    	setImageUrl(URL.createObjectURL(selectedFile))
	  };

	const handleUploadImage = async (e) => {
		e.preventDefault()
	if (selectedImage) {
		const formData = new FormData();
		formData.append("file", selectedImage);

		try {
		const response = await axios.post("http://localhost:3000/user/upload", formData, {
			headers: {
			"type": "multipart/form-data",
			},
			onUploadProgress: (progressEvent) => {
			const progress = Math.round(
				(progressEvent.loaded * 100) / progressEvent.total
			);
			setUploadProgress(progress);
			},
		});

		if (response.data) {
			// Handle success, e.g., update user's profile picture
			console.log("Image uploaded successfully:", response.data);
		}
		} catch (error) {
		console.error("Error uploading image:", error);
		}
	}
	};


	return (
		<div className="space-y-10 divide-y divide-gray-900/10">
			{loading ? (
				<p>Loading user data...</p>
			) : user ? (
				<div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
					<div className="px-4 sm:px-0">
						<h2 className="text-base font-semibold leading-7 text-gray-900">Account Information</h2>
						<p className="mt-1 text-sm leading-6 text-gray-600">Make any changes.</p>
					</div>
					<form onSubmit={handleUploadImage} className="space-y-6">
						<div className="flex flex-col items-center justify-center">	
							<label
								htmlFor="image-upload"
								className="block text-sm font-medium text-gray-700"
								>
								Change Profile Picture
							</label>
							<input
								type="file"
								id="image-upload"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
								/>
							{imageUrl && (
								<img
								src={imageUrl}
								alt="Selected"
								className="mt-2 rounded-full w-16 h-16 object-cover"
								/>
							)}
							</div>
						<button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" >Save</button>
						{uploadProgress > 0 && (<p className="text-indigo-600">Uploading: {uploadProgress}%</p>)}
					</form>
					<form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2" onSubmit={handleSubmit}>
						<div className="px-4 py-6 sm:p-8">

							<div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

								{/* First Name Input */}
								<InputField 
									label="First Name"
									type="text"
									name="firstName"
									value={editedUser.firstName}
									onChange={handleEditChange}
								/>

								{/* Last Name Input */}
								<InputField 
									label="Last Name"
									type="text"
									name="lastName"
									value={editedUser.lastName}
									onChange={handleEditChange}
								/>

								{/* Email Input */}
								<InputField 
									label="Email"
									type="email"
									name="email"
									value={editedUser.email}
									onChange={handleEditChange}
									error={emailError}
								/>

								{/* Username Input */}
								<InputField 
									label="Username"
									type="text"
									name="username"
									value={editedUser.username}
									onChange={handleEditChange}
								/>

								{/* New Password Input */}
								<InputField 
									label="New Password"
									type="password"
									name="newPassword"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>

								{/* Confirm Password Input */}
								<InputField 
									label="Confirm Password"
									type="password"
									name="confirmPassword"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>

							</div>
						</div>
						<div className="flex items-center  justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
							<button type="button" onClick={handleDeleteAccount} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
								Delete Account
							</button>
							<button
								type="submit"
								className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Save
							</button>
						</div>
					</form>
				</div>
			) : (
				<p>User data not available.</p>
			)}
		</div>
	);
}

const InputField = ({ label, type, name, value, onChange, error }) => (
	<div className="sm:col-span-3">
		<label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
			{label}
		</label>
		<div className="mt-2">
			<input
				type={type}
				name={name}
				id={name}
				value={value}
				onChange={onChange}
				autoComplete={name}
				className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
			{error && <p className="text-red-600 mt-1">{error}</p>}
		</div>
	</div>
);

export default Settings;
