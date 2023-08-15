import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts";

import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { app } from '/firebase-config.js';


export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const db = getFirestore(app);

  async function handleSubmit(e) {

	e.preventDefault();
	const options = {
	  method: "POST",
	  headers: { "content-type": "application/json" },
	  body: JSON.stringify(form),
	};
	const res = await fetch("http://localhost:3000/user/login", options);
	if (res.ok) {
	  const data = await res.json();
	  if (!data.user.isVerified) {
		alert(
		  `Verification email has been sent to ${data.user.email}. Please verify your account first.`
		);
		navigate("/login");
	  } else if (data.authenticated) {
		// set AuthContext to username
		setUser({
		  firstName: data.user.firstName,
		  lastName: data.user.lastName,
		  userId: data.user.id,
		});
		try {
		  const userCollection = collection(db, 'users');
		  const userDocRef = doc(userCollection, data.user.id.toString());
		  await setDoc(userDocRef, data.user, { merge: true });
		} catch (error) {
		  console.error("Error adding user to Firestore: ", error);
		}
		// set token to local storage
		localStorage.setItem("token", data.token);
		localStorage.setItem("id", data.user.id);
		localStorage.setItem("firstname", data.user.firstName);
		navigate("/dash");
	  }
	}
  }

  return (
	<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
		<img className="mx-auto h-10 w-auto" src="https://firebasestorage.googleapis.com/v0/b/learnt-me-test.appspot.com/o/manual%2Flogo.svg?alt=media&token=1b976e10-5cf3-42e0-827a-136ced55ba58" alt="Your Company" />
		<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
	  </div>

	  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form onSubmit={handleSubmit} className="space-y-6">
		  <div>
			<label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
			<div className="mt-2">
			  <input id="username" name="username" type="text" autoComplete="username" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={(e) => setForm({ ...form, username: e.target.value })} />
			</div>
		  </div>

		  <div>
			<div className="flex items-center justify-between">
			  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
			  <div className="text-sm">
				<Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
			  </div>
			</div>
			<div className="mt-2">
			  <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={(e) => setForm({ ...form, password: e.target.value })} />
			</div>
		  </div>

		  <div>
			<button data-testid="button" type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
		  </div>
		</form>

		<div className="mt-10 text-center text-sm text-gray-500">
		  Not a member?&nbsp;
		  <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up</Link>
		</div>
	  </div>
	</div>
  );
}
