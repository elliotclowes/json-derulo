import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchResults from './index'; // Make sure to adjust the import path
import { BrowserRouter } from 'react-router-dom';
import matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

describe('SearchResults', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    // it('displays delete confirmation dialog on delete link click', () => {
    //     const mockSummary = {
    //         id: 'mockId',
    //         title: 'Mock Summary Title',
    //     };

    //     const { getByText, getByTestId } = render(<BrowserRouter><SearchResults /></BrowserRouter>, container);
    //     const deleteLink = getByText('Delete, Mock Summary Title');

    //     fireEvent.click(deleteLink);

    //     const deleteDialog = getByTestId('delete-dialog');
    //     expect(deleteDialog).toBeInTheDocument();
    // });

    // it('renders search results and "No search results" message', () => {

    //     const mockSummaries = [
    //         { id: 'summaryId1', title: 'Summary 1', tags: ['tag1'], visibility: 'public', created: Date.now() },
    //         { id: 'summaryId2', title: 'Summary 2', tags: ['tag2'], visibility: 'private', created: Date.now() },
    //     ];

    //     const { getByText, queryByText } = render(<BrowserRouter><SearchResults /></BrowserRouter>, container);


    //     mockSummaries.forEach(summary => {
    //         const summaryTitle = getByText(summary.title);
    //         expect(summaryTitle).toBeInTheDocument();

    //         const deleteLink = getByText(`Delete, ${summary.title}`);
    //         expect(deleteLink).toBeInTheDocument();
    //     });


    //     const noResultsMessage = queryByText('No search results found');
    //     expect(noResultsMessage).not.toBeInTheDocument();
    // });

    it('renders "No search results" message when no summaries are available', () => {
        const { getByText } = render(<BrowserRouter><SearchResults /></BrowserRouter>, container);
        const noResultsMessage = getByText('No search results found');
        expect(noResultsMessage).toBeInTheDocument();
    });

    it('renders SearchResults component', () => {
        render(
            <BrowserRouter>
                <SearchResults />
            </BrowserRouter>
        );

        expect(screen.getByText(/Search Results for:/i)).toBeInTheDocument();
    });


});
