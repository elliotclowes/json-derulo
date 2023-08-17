import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers'
import { BrowserRouter } from 'react-router-dom';
import { UserSummariesList } from '../../components';
expect.extend(matchers)

describe('UserSummaries', () => {
    it('renders the UserSummariesList component', () => {
        render(<BrowserRouter><UserSummariesList /></BrowserRouter>);
        const createSummaryButton = screen.getByTestId('button');
        expect(createSummaryButton).toBeInTheDocument();

    });

    // it('renders the Footer component', () => {
    //     render(<BrowserRouter><UserSummariesList /></BrowserRouter>);

    //     const footerContent = screen.getByText('Copyright © 2023. All right reserved'); 
    //     expect(footerContent).toBeInTheDocument();
    // });

});
