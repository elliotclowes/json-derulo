import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import HoveringMenuEditor from './index.jsx'; // Make sure to adjust the import path

describe('HoveringMenuEditor', () => {
    it('renders correctly', () => {
        render(<HoveringMenuEditor document={[]} />);
    });

    // it('toggles bold mark on format-bold click', () => {
    //     const { getByTestId, getByText } = render(<HoveringMenuEditor document={[]} />);

    //     // const editor = getByTestId('format-bold');
    //     // fireEvent.click(editor);


    //     const toolbar = getByTestId('hovering-toolbar');


    //     const boldButton = toolbar.querySelector('[data-testid="format-bold"]');
    //     fireEvent.click(boldButton);

    //     const textNode = getByText('Enter some text...');
    //     expect(textNode.querySelector('strong')).toBeTruthy();
    // });

});
