import React from 'react';
import { render } from '@testing-library/react';
import LoginForm from './index'; // Make sure to adjust the import path
import { AuthProvider } from '../../contexts';
import { BrowserRouter } from 'react-router-dom';

describe('Login', () => {
    it('renders without errors', () => {
        render(<AuthProvider><BrowserRouter><LoginForm /></BrowserRouter></AuthProvider>);
    });
});