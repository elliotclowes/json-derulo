import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AudioRecorder from './index';
import { BrowserRouter } from 'react-router-dom';
import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

describe('AudioRecorder', () => {
    it('renders AudioRecorder component', () => {
        render(
            <BrowserRouter>
                <AudioRecorder />
            </BrowserRouter>
        );


        expect(screen.getByTestId('controls')).toBeInTheDocument();
        expect(screen.getByTestId('audio-container')).toBeInTheDocument();
    });

    it('start and stop buttons are rendered.', async () => {
        render(
            <BrowserRouter>
                <AudioRecorder />
            </BrowserRouter>
        );


        const startButton = screen.getByRole('button', { name: /start/i });
        const stopButton = screen.getByRole('button', { name: /stop/i });

        expect(startButton).toBeInTheDocument()
        expect(stopButton).toBeInTheDocument()


    });

    it('can start recording', async () => {
        render(
            <BrowserRouter>
                <AudioRecorder />
            </BrowserRouter>
        );

        const startButton = screen.getByRole('button', { name: /start/i });

        fireEvent.click(startButton);


    });

    it('can stop recording', async () => {
        render(
            <BrowserRouter>
                <AudioRecorder />
            </BrowserRouter>
        );

        const startButton = screen.getByRole('button', { name: /start/i });
        const stopButton = screen.getByRole('button', { name: /stop/i });

        fireEvent.click(startButton);

        // Wait for some time to simulate recording
        await waitFor(() => {
            expect(stopButton).toBeInTheDocument();
        });

        fireEvent.click(stopButton);


    });




});
