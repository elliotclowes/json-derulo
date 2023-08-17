import React from 'react';
import { render } from '@testing-library/react';
import CreateSummary from './index'; // Make sure to adjust the import path

describe('CreateSummary', () => {
    it('renders without errors', () => {
        render(<CreateSummary />);
    });
});
