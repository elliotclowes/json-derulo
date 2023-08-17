import React from 'react';
import { render } from '@testing-library/react';
import CreateSummary from './index';
import { BrowserRouter } from 'react-router-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { AuthProvider } from '../../contexts';
expect.extend(matchers);

test('renders CreateSummary component', () => {
    const { getByText } = render(<AuthProvider><BrowserRouter><CreateSummary /></BrowserRouter></AuthProvider>);

    const settingsComponent = getByText('Settings');
    expect(settingsComponent).toBeInTheDocument();
});
