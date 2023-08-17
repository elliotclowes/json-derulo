import React from 'react';
import { render } from '@testing-library/react';
import TeacherSummary from './index';
import { BrowserRouter } from 'react-router-dom';

describe('TeacherSummary', () => {
    it('renders without errors', () => {
        render(<BrowserRouter><TeacherSummary /></BrowserRouter>);
    });
});