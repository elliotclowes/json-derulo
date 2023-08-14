import React from "react";
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './index';
import { AuthProvider } from "../../contexts";
import { useAuth } from "../../contexts";


describe('LoginForm', () => {

    afterEach(() => {
        cleanup();
    });

    it('renders LoginForm', () => {
        <BrowserRouter>
            <AuthProvider>
                render(< LoginForm />);
            </AuthProvider>
        </BrowserRouter>
    });

    it('should render login page with form fields', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        );

        const usernameInput = screen.getByRole('textbox', { name: /username/i });
        const passwordInput = screen.getByLabelText(/password/i);

        expect(usernameInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();
    });

    it('should login successfully and redirect to dashboard when user is verified', async () => {
        // Mock the fetch function to return a successful response with authenticated and verified user
        vi.spyOn(window, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                authenticated: true,
                user: {
                    isVerified: true, // Simulate a verified user
                    firstName: 'John',
                    lastName: 'Doe',
                    id: 123,
                },
                token: 'fake_token',
            }),
        });

        // Mock the setUser function from the context
        const setUserMock = jest.fn();
        vi.spyOn(useAuth, 'useAuth').mockReturnValue({
            setUser: setUserMock,
        });

        // Mock the navigate function
        const navigateMock = jest.fn();
        vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

        // Render the component
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        );


        // Simulate form input and submission
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

        const submitButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(submitButton);

        // Wait for any asynchronous operations to complete
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Assertions
        expect(window.fetch).toHaveBeenCalledTimes(1);
        expect(setUserMock).toHaveBeenCalledWith({
            firstName: 'John',
            lastName: 'Doe',
            userId: 123,
        });
        expect(navigateMock).toHaveBeenCalledWith('/dash'); // Check if navigation to dashboard route occurred
    });


});
