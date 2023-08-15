import { Link } from "react-router-dom";
import { useState } from "react";

export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/user/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const user = await res.json();
      console.log(user);
      alert(
        "Register Successfully! Verification Email has been sent to your email. Please verify your account before enjoying our app."
      );
    } else {
      alert("Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="firstName" className="block text-sm font-medium">First name</label>
          <input
            type="text"
            placeholder="firstname"
            id="firstName"
            name="firstName"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="lastName" className="block text-sm font-medium">Last name</label>
          <input
            type="text"
            placeholder="lastName"
            id="lastName"
            name="lastName"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="email@email.com"
          id="email"
          name="email"
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium">Username</label>
        <input
          type="text"
          placeholder="username"
          id="username"
          name="username"
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="input-field">
        <input
          type="submit"
          className="btn"
          value="Register"
        />
      </div>
      <div className="signup text-center">
        <span>
          Already have an account? <Link to="/login" className="text-blue-500">Login here</Link>
        </span>
      </div>
    </form>
  );
}
