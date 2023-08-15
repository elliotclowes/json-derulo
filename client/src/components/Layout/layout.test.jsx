import React from "react";
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers'
import { BrowserRouter } from 'react-router-dom';
import Navigation from './index';
expect.extend(matchers)


describe('Navigation', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders Navigation', () => {
        render(
            <BrowserRouter>
                <Navigation />;
            </BrowserRouter>
        )

        expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <BrowserRouter>
                <Navigation />;
            </BrowserRouter>
        )

        const navigationLinks = screen.getAllByRole('link');
        expect(navigationLinks).toHaveLength(7);
    });


});



