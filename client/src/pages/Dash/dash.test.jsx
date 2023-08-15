import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers'
import CreateSummary from './index';
import { BrowserRouter } from 'react-router-dom';
expect.extend(matchers)

describe('CreateSummary', () => {

    it('renders the Footer component', () => {
        render(<BrowserRouter><CreateSummary /></BrowserRouter>);
        const footerContent = screen.getByText('Copyright © 2023. All right reserved');
        expect(footerContent).toBeInTheDocument();
    });
});
