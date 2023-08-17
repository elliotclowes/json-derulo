import React from 'react';
import { render } from '@testing-library/react';
import UserSummaries from './index';
import { BrowserRouter } from 'react-router-dom';

test('renders UserSummaries component', () => {
    render(<BrowserRouter><UserSummaries /></BrowserRouter>);


});
