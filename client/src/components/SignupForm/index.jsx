import "../LoginForm/styles.css";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
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
  const [isTeacher, setIsTeacher] = useState(false);

  function handleChange(e) {
    
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: newValue });
    setIsTeacher(!isTeacher);
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
      <form onSubmit={handleSubmit}>
        <div className="name">
          <FloatingLabel
            controlId="floatingInput"
            label="First name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="firstname"
              name="firstName"
              onChange={(e) => handleChange(e)}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Last name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="lastName"
              name="lastName"
              onChange={(e) => handleChange(e)}
            />
          </FloatingLabel>
        </div>
        <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder="email@email.com"
            name="email"
            onChange={(e) => handleChange(e)}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Username"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password">
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
        </FloatingLabel>
        <br />
        <label>
          
          <input
            type="checkbox"
            checked={form.teacher}
            onChange={handleChange}
            name="teacher"
          /> Are you a teacher?
        </label>
        <div className="input-field">
          <input type="submit" className="submit" value="Register" />
        </div>
        <div className="signup">
          <span>
            Already have an account? <Link to="/login">Login here</Link>
          </span>
        </div>
      </form>
    </>
  );
}
