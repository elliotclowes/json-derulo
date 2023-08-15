import "./styles.css";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
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
    <>
      <form onSubmit={handleSubmit}>
        <FloatingLabel
          controlId="floatingInput"
          label="Username"
          className="mb-3"
        >
          <Form.Control
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            type="text"
            placeholder="username"
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password">
          <Form.Control
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            placeholder="Password"
          />
        </FloatingLabel>
        <div className="input-field">
          <input type="submit" className="submit" value="Login" />
        </div>
        <div className="signup">
          <span>
            Don't have an account? <Link to="/signup">Register here</Link>
          </span>
        </div>
      </form>
    </>
  );
}
