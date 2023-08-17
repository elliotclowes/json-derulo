import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import SummaryInput from './index';

describe('SummaryInput Component', () => {

    it('renders input and button', () => {
        const { getByLabelText, getByText } = render(<SummaryInput documentId="testDocument" />);

        const inputElement = getByLabelText('Update summary:');
        const buttonElement = getByText('Update');

        expect(inputElement).toBeTruthy();
        expect(buttonElement).toBeTruthy();
    });

    // it('updates summary when button is clicked', () => {

    //     const getElementByIdMock = vi.spyOn(document, 'getElementById').mockReturnValue({ value: 'New summary content' });
    //     const updateFunctionMock = vi.spyOn(firebase.firestore.DocumentReference.prototype, 'update');

    //     const { getByText } = render(<SummaryInput documentId="testDocument" />);


    //     fireEvent.click(getByText('Update'));


    //     expect(updateFunctionMock).toHaveBeenCalledWith({ content: 'New summary content' });


    //     getElementByIdMock.restore();
    //     updateFunctionMock.restore();
    // });
});
