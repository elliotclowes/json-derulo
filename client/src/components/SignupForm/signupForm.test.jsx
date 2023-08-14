import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SignupForm from './index';

describe('SignupForm', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders SignupForm', () => {
        render(
            <BrowserRouter>
                <SignupForm />
            </BrowserRouter>
        );
    });

    it('should render sign up page with form fields', () => {
        render(
            <BrowserRouter>
                <SignupForm />
            </BrowserRouter>
        );

        const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
        const lastNameInput = screen.getByRole('textbox', { name: /last name/i });
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const usernameInput = screen.getByRole('textbox', { name: /username/i });

        expect(firstNameInput).toBeTruthy();
        expect(lastNameInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(usernameInput).toBeTruthy();
    })

    it('should submit the form and display success alert', async () => {
        render(
            <BrowserRouter>
                <SignupForm />
            </BrowserRouter>
        );

        const submitButton = screen.getByRole('button', { name: /register/i });

        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'johndoe' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securepassword' } });

        vi.spyOn(window, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                message: 'User registered successfully',
            }),
        });

        const alertSpy = vi.spyOn(window, 'alert');

        fireEvent.click(submitButton);

        await new Promise((resolve) => setTimeout(resolve, 0)); // This waits for any asynchronous operations

        expect(alertSpy).toHaveBeenCalledWith(
            "Register Successfully! Verification Email has been sent to your email. Please verify your account before enjoying our app."
        );
    });


    it('should display error alert when registration fails', async () => {
        render(
            <BrowserRouter>
                <SignupForm />
            </BrowserRouter>
        );

        const submitButton = screen.getByRole('button', { name: /register/i });

        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'johndoe' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securepassword' } });

        vi.spyOn(window, 'fetch').mockResolvedValueOnce({
            ok: false,
        });

        const alertSpy = vi.spyOn(window, 'alert');

        fireEvent.click(submitButton);

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(alertSpy).toHaveBeenCalledWith("Something went wrong.");
    });


});
<<<<<<< HEAD

=======
>>>>>>> 8d50ee8ed9d86104de03849ffe2ea6f4ea37c02c
