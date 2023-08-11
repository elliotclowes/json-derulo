import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { setUser } = useAuth();
  const navigate = useNavigate();

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
        // set token to local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("firstname", data.user.firstName);
        navigate("/dash");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-floating">
        <input
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          type="text"
          className="form-control"
          placeholder="Username"
          required
        />
        <label>Username</label>
      </div>
      <div className="form-floating">
        <input
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          className="form-control"
          placeholder="Password"
          required
        />
        <label>Password</label>
      </div>
      <div>
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Login
        </button>
      </div>
      <div className="text-center">
        <span>
          Don't have an account? <Link to="/signup" className="text-blue-500">Register here</Link>
        </span>
      </div>
    </form>
  );
}
