import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    teacher: false,
    password: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      // navigate('/dash');
    }
  }, [navigate]);

  const [emailError, setEmailError] = useState('');

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });

    if (e.target.name === 'email') {
      validateEmail(value);
    }
  }

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(JSON.stringify(form));
    const res = await fetch('http://localhost:3000/user/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const user = await res.json();
      console.log(user);
      alert(
        'Register Successfully! Verification Email has been sent to your email. Please verify your account before enjoying our app.'
      );
      navigate('/login');
    } else {
      const errorResponse = await res.json();
      if (errorResponse.error === 'Username already registered.') {
        alert('Username already registered. Please choose a different username.')
      } else if (errorResponse.error === 'Email already registered.') {
        alert('Email already registered. Please use a different email.')
      } else {
        alert('Something went wrong.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="firstName" className="block text-sm font-medium">
            First name
          </label>
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
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last name
          </label>
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
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          placeholder="email@email.com"
          id="email"
          name="email"
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        {emailError && <p className="error-message">{emailError}</p>}
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
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
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
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
        <input type="submit" className="btn" value="Register" />
      </div>
      <br />
      <div>
        <input
          type="checkbox"
          id="teacher"
          name="teacher"
          onChange={handleChange}
        />
        <label htmlFor="teacher">Are you a teacher?</label>
      </div>
      <div className="signup text-center">
        <span>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500">
            Login here
          </Link>
        </span>
      </div>
    </form>
  );
}
