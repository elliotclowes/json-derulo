import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlocksDisplay from './index';

test('renders blocks correctly', () => {
    const documentId = 'mockDocumentId';

    render(<BlocksDisplay documentId={documentId} />);


});
