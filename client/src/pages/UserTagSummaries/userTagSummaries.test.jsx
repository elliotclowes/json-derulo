import React from 'react';
import { render } from '@testing-library/react';
import UserSummariesTagList from './index';
import { BrowserRouter } from 'react-router-dom';

describe('UserSummariesTagList', () => {
    it('renders without errors', () => {
        render(<BrowserRouter><UserSummariesTagList /></BrowserRouter>);
    });
});