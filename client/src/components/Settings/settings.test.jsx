import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Settings from './index';
import { getUserID } from './getUserID';
import { BrowserRouter } from 'react-router-dom';
import matchers from '@testing-library/jest-dom/matchers'
import { AuthProvider } from '../../contexts';
expect.extend(matchers)


it('renders Settings component', () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <Settings />
            </AuthProvider>
        </BrowserRouter>
    );


    expect(screen.getByText('Account Settings')).toBeInTheDocument();
});



it('displays loading text while fetching user data', () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <Settings />
            </AuthProvider>
        </BrowserRouter>
    );

    expect(screen.getByText('Loading user data...')).toBeInTheDocument();
});

it('displays user data form fields after loading', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            username: 'johndoe',
        }),
    });


    render(
        <BrowserRouter>
            <AuthProvider>
                <Settings />
            </AuthProvider>
        </BrowserRouter>
    );

    // Wait for the loading to complete
    await screen.findByLabelText('First Name:');

    const expectedUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
    };

    // Now, let's perform the assertions using the expected user data
    const firstNameField = screen.getByRole('textbox', { name: /first name/i });
    const lastNameField = screen.getByRole('textbox', { name: /last name/i });
    const emailField = screen.getByRole('textbox', { name: /email/i });
    const usernameField = screen.getByRole('textbox', { name: /username/i });
    // const newPasswordField = screen.getByRole('textbox', { name: /new password/i });
    // const confirmPasswordField = screen.getByRole('textbox', { name: /confirm password/i });

    expect(firstNameField).toBeInTheDocument();
    expect(firstNameField).toHaveValue(expectedUserData.firstName);
    expect(lastNameField).toBeInTheDocument();
    expect(lastNameField).toHaveValue(expectedUserData.lastName);
    expect(emailField).toBeInTheDocument();
    expect(emailField).toHaveValue(expectedUserData.email);
    expect(usernameField).toBeInTheDocument();
    expect(usernameField).toHaveValue(expectedUserData.username);
    // expect(newPasswordField).toBeInTheDocument();
    // expect(confirmPasswordField).toBeInTheDocument();
});

describe('Settings Component Functions', () => {
    it('handles editing user data', async () => {

        vi.spyOn(window, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                username: 'johndoe',
                password: 'password'
            }),
        });

        const { getByLabelText } = render(
            <BrowserRouter>
                <AuthProvider>
                    <Settings />
                </AuthProvider>
            </BrowserRouter>
        );

        await screen.findByLabelText('First Name:');


        const firstNameInput = screen.getByLabelText('First Name:');
        fireEvent.change(firstNameInput, { target: { value: 'John' } });

        expect(firstNameInput.value).toBe('John');
    });

    it('validates email correctly', async () => {

        vi.spyOn(window, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                username: 'johndoe',
            }),
        });

        const { getByLabelText, getByText } = render(
            <BrowserRouter>
                <AuthProvider>
                    <Settings />
                </AuthProvider>
            </BrowserRouter>
        );

        await screen.findByLabelText('First Name:');

        const emailInput = getByLabelText('Email:');
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        expect(getByText('Please enter a valid email address.')).toBeInTheDocument();
    });

    it('handles password confirmation correctly', async () => {

        vi.spyOn(window, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                username: 'johndoe',
            }),
        });

        const { getByLabelText, getByText } = render(
            <BrowserRouter>
                <AuthProvider>
                    <Settings />
                </AuthProvider>
            </BrowserRouter>
        );

        await screen.findByLabelText('First Name:');

        const newPasswordInput = getByLabelText('New Password:');
        const confirmPasswordInput = getByLabelText('Confirm Password:');
        fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'invalidpassword' } });

        const submitButton = screen.getByText('Save Changes');

        const alertSpy = vi.spyOn(window, 'alert');

        fireEvent.click(submitButton);

        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                'Passwords do not match. Please try again.')
        );
    });




    // it('handles account deletion correctly', async () => {

    //     vi.spyOn(window, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //         json: async () => ({
    //             firstName: 'John',
    //             lastName: 'Doe',
    //             email: 'john@example.com',
    //             username: 'johndoe',
    //         }),
    //     });

    //     const { getByLabelText, getByText } = render(
    //         <BrowserRouter>
    //             <AuthProvider>
    //                 <Settings />
    //             </AuthProvider>
    //         </BrowserRouter>
    //     );

    //     await screen.findByLabelText('First Name:');

    //     const deleteButton = screen.getByText('Delete Account');
    //     let alertCalled = false; // Temporary variable to track if window.alert was called
    //     const originalAlert = window.alert; // Store the original window.alert function
    //     window.alert = (message) => {
    //         if (message === alertMessage) {
    //             alertCalled = true;
    //         }
    //     };

    //     fireEvent.click(deleteButton);


    //     window.alert = originalAlert;
    //     console.log(originalAlert)


    //     expect(alertCalled).toBe(true);

    // });

    it('fetches user ID correctly', async () => {
        const token = 'fakeToken';
        const userId = '12345';

        vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(token);

        vi.spyOn(window, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user_id: userId }),
        });

        const result = await getUserID();

        expect(result).toEqual(userId);
        expect(localStorage.getItem).toHaveBeenCalledWith('token');
        expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/token/get/${token}`);
    });

    // describe('Settings Component Functions', () => {
    //     it('handles submitting changes', async () => {
    //         const mockResponse = {
    //             ok: true,
    //             json: async () => ({
    //                 firstName: 'John',
    //                 lastName: 'Doe',
    //                 email: 'john@example.com',
    //                 username: 'johndoe',
    //             }),
    //         };

    //         vi.spyOn(window, 'fetch').mockResolvedValueOnce(mockResponse);

    //         const { getByLabelText, getByText } = render(
    //             <BrowserRouter>
    //                 <AuthProvider>
    //                     <Settings />
    //                 </AuthProvider>
    //             </BrowserRouter>
    //         );

    //         await screen.findByLabelText('First Name:');

    //         const firstNameInput = getByLabelText('First Name:');
    //         fireEvent.change(firstNameInput, { target: { value: 'John' } });

    //         const alertMessages = [];


    //         vi.spyOn(window, 'alert').mockImplementation(message => {
    //             alertMessages.push(message);
    //         });

    //         const saveChangesButton = screen.getByText('Save Changes');
    //         fireEvent.click(saveChangesButton);


    //         await waitFor(() => {
    //             expect(alertMessages).toContain(
    //                 expect.stringContaining('Changes saved successfully!')
    //             );
    //         });


    //         window.alert.mockRestore();
    //     });

    // })

});