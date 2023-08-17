import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './index';
import { getUserID } from './getUserID'
import { BrowserRouter } from 'react-router-dom';
import matchers from '@testing-library/jest-dom/matchers'
import { AuthProvider } from '../../contexts';
expect.extend(matchers)


describe('App Component', () => {
    it('renders input and button', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        );

        const inputElement = screen.getByPlaceholderText('Enter YouTube URL');
        const buttonElement = screen.getByText('Process Video');
        expect(inputElement).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
    });

    it('displays loading overlay when processing video', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        );

        const inputElement = screen.getByPlaceholderText('Enter YouTube URL');
        const buttonElement = screen.getByText('Process Video');


        fireEvent.change(inputElement, { target: { value: 'https://www.youtube.com' } });
        fireEvent.click(buttonElement);


        const loadingOverlay = screen.getByTestId('loading-overlay');
        expect(loadingOverlay).toBeInTheDocument();
    });

    it('displays subtitles after processing video', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        );

        const inputElement = screen.getByPlaceholderText('Enter YouTube URL');
        const buttonElement = screen.getByText('Process Video');

        fireEvent.change(inputElement, { target: { value: 'https://www.youtube.com' } });
        fireEvent.click(buttonElement);

        await new Promise(resolve => setTimeout(resolve, 4900));

        const subtitlesElement = screen.findByTestId('subtitles');
        expect(subtitlesElement).toBeTruthy
    });

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

});