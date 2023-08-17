import React from 'react';
import { render } from '@testing-library/react';
import DeleteSummaryConfirmationDialog from './index';

test('renders DeleteSummaryConfirmationDialog component', () => {
    const open = true;
    const onClose = () => { };
    const onDelete = () => { };
    const summaryTitle = 'Test Summary';

    render(
        <DeleteSummaryConfirmationDialog
            open={open}
            onClose={onClose}
            onDelete={onDelete}
            summaryTitle={summaryTitle}
        />
    );

});
