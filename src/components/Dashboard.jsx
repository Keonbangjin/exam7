import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    text-align: center;
`;

const Button = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    margin: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #0056b3;
    }
`;

const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    }

    return (
        <Container>
            <h2>Welcome to our Website</h2>
            <Button onClick={() => handleNavigation('/product')}>Go to Product</Button>
            <Button onClick={() => handleNavigation('/categories')}>Go to Categories</Button>
            <Button onClick={() => handleNavigation('/login')}>Go to Login</Button>
        </Container>
    );
}

export default Home;
