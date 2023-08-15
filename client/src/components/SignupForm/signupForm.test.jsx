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

        await new Promise((resolve) => setTimeout(resolve, 0));

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

    it('should handle form field changes', () => {
        const { getByLabelText } = render(<BrowserRouter><SignupForm /></BrowserRouter>);

        fireEvent.change(getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(getByLabelText(/username/i), { target: { value: 'johndoe' } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: 'securepassword' } });
        fireEvent.click(getByLabelText(/teacher/i));

        expect(getByLabelText(/first name/i)).toHaveValue('John');
        expect(getByLabelText(/last name/i)).toHaveValue('Doe');
        expect(getByLabelText(/email/i)).toHaveValue('john@example.com');
        expect(getByLabelText(/username/i)).toHaveValue('johndoe');
        expect(getByLabelText(/password/i)).toHaveValue('securepassword');
        expect(getByLabelText(/teacher/i)).toBeChecked();
    });




});
