import React from 'react';
import { render } from '@testing-library/react';
import AudioContainer from './index';
import { BrowserRouter } from 'react-router-dom';
import matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

test('renders AudioContainer component', () => {

    const { getByTestId } = render(<BrowserRouter><AudioContainer /></BrowserRouter>);

    const audioContainer = getByTestId('audio-container');

    expect(audioContainer).toBeInTheDocument();
});
