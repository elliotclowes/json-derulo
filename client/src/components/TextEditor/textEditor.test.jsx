import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TextEditor from './index';

describe('TextEditor', () => {
    it('renders without errors', () => {
        const initialDocument = [];
        const onChange = () => { };

        const { container } = render(<TextEditor document={initialDocument} onChange={onChange} />);

        expect(container).toBeDefined();

    })
});
