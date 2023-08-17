import React from 'react';
import { render } from '@testing-library/react';
import UserPage from './index';
import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

test('renders UserPage component', () => {
    const { getByText } = render(<UserPage />);

    const headerElement = getByText('User Info will go on this page');
    expect(headerElement).toBeInTheDocument();
});
