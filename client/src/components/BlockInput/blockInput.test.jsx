import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BlockInput from './index';
import { BrowserRouter } from 'react-router-dom';
import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

describe('BlockInput', () => {
    it('renders BlockInput component', () => {
        render(
            <BrowserRouter>
                <BlockInput />
            </BrowserRouter>
        );

        expect(screen.getByLabelText('Title:')).toBeInTheDocument();
        expect(screen.getByLabelText('Content:')).toBeInTheDocument();
        expect(screen.getByText('Block 1:')).toBeInTheDocument();
        expect(screen.getByText('Block 2:')).toBeInTheDocument();
        expect(screen.getByText('Block 3:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });



});