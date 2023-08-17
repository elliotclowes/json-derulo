import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import matchers from "@testing-library/jest-dom/matchers";
import '@testing-library/jest-dom/extend-expect';
expect.extend(matchers);
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './index';
import { AuthProvider } from "../../contexts";
import { useAuth } from "../../contexts";


describe('LoginForm', () => {

    afterEach(() => {
        cleanup();
    });

    test('renders LoginForm', () => {
        <BrowserRouter>
            <AuthProvider>
                render(< LoginForm />);
            </AuthProvider>
        </BrowserRouter>
    });

    test('should render login page with form fields', () => {
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

    test('should handle form submission for unverified user', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        )

        const submitButton = screen.getByTestId('button', { name: /sign up/i });
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securepassword' } });

        vi.spyOn(window, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                user: {
                    isVerified: false,
                    email: 'john@example.com'
                }
            }),
        });

        const alertSpy = vi.spyOn(window, 'alert');
        fireEvent.click(submitButton);

        await new Promise((resolve) => setTimeout(resolve, 0));


        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                "Verification email has been sent to john@example.com")
        );
    })

    // test('should handle form submission for verified user', async () => {
    //     render(
    //         <BrowserRouter>
    //             <AuthProvider>
    //                 <LoginForm />
    //             </AuthProvider>
    //         </BrowserRouter>
    //     );

    //     const submitButton = screen.getByTestId('button', { name: /sign up/i });
    //     fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'John' } });
    //     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securepassword' } });


    //     vi.spyOn(window, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //         json: async () => ({
    //             authenticated: true,
    //             user: {
    //                 firstName: 'John',
    //                 lastName: 'Doe',
    //                 id: '123'
    //             },
    //             token: 'mockToken'
    //         }),
    //     });

    //     const setUserSpy = vi.spyOn(useAuth(), 'setUser');
    //     const localStorageSpy = vi.spyOn(localStorage, 'setItem');
    //     const navigateSpy = vi.spyOn(useNavigate(), 'navigate');

    //     fireEvent.click(submitButton);

    //     await new Promise((resolve) => setTimeout(resolve, 0));

    //     expect(setUserSpy).toHaveBeenCalledWith({
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         userId: '123'
    //     });

    //     expect(localStorageSpy).toHaveBeenCalledWith('token', 'mockToken');
    //     expect(localStorageSpy).toHaveBeenCalledWith('id', '123');
    //     expect(localStorageSpy).toHaveBeenCalledWith('firstname', 'John');

    //     expect(navigateSpy).toHaveBeenCalledWith('/dash');
    // });


});