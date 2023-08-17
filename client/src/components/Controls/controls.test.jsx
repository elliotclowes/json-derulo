import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Controls from './index';
import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

describe('Controls', () => {
    it('renders Controls component', () => {
        render(
            <Controls handlers={{ startRecording: () => { }, stopRecording: () => { } }} isRecording={false} />
        );

        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(screen.getByText('Stop')).toBeInTheDocument();
    });


});
