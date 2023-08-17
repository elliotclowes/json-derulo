import React from 'react';
import { render } from '@testing-library/react';
import Recorder from './index'; // Make sure to adjust the import path

describe('Recorder', () => {
    it('renders without errors', () => {
        render(<Recorder />);
    });
});