import React from 'react';
import { render } from '@testing-library/react';
import Notes from './index'

describe('Notes', () => {
    it('renders without errors', () => {
        render(<Notes />);
    });
});