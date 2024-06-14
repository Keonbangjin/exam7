import React, { useState } from 'react';
import { Button, Card, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/auth', {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      message.success('Login successful!');
      navigate('/'); 
    } catch (error) {
      message.error('Login failed. Please check your password.');
      console.error('Login failed', error);
    }
  };

  return (
    <div className="login-container">
      <Card
        title={<h2 style={{ textAlign: 'center', color: '#52c41a', marginBottom: 0 }}>Welcome Back!</h2>}
        bordered={false}
        style={{ width: 300, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}
        className="login-card"
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '20px', borderRadius: '5px' }}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '20px', borderRadius: '5px' }}
        />
        <Button
          type="primary"
          block
          style={{ borderRadius: '5px', background: '#52c41a', borderColor: '#52c41a' }}
          onClick={handleSubmit}
        >
          Login
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
