import React from "react";
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './index';


describe('Navigation', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders Navigation', () => {
        <BrowserRouter>
            render(<Navigation />);
        </BrowserRouter>
    });

    it('should have a Navbar with the brand text', () => {
        render(
            <BrowserRouter>
                <Navigation />
            </BrowserRouter>
        );

        const brandText = screen.getByText('SuperSpeech');
        expect(brandText).toBeTruthy()
    });


});