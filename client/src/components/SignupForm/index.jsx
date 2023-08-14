import { Link } from "react-router-dom";
import { useState } from "react";

export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    teacher:false,
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
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium">First name</label>
            <input
              type="text"
              placeholder="firstname"
              name="firstName"
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium">Last name</label>
            <input
              type="text"
              placeholder="lastName"
              name="lastName"
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="email@email.com"
            name="email"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            placeholder="username"
            name="username"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Password"
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
        <br />
        <input
         type="checkbox"
         name="teacher"
         onChange={(e) => handleChange(e)}
        />
        <label>Are you a teacher?</label>
        <div className="signup text-center">
          <span>
            Already have an account? <Link to="/login" className="text-blue-500">Login here</Link>
          </span>
        </div>  
      </form>
    </>
  );
}
