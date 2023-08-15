import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from "../../contexts";
import '@testing-library/jest-dom/extend-expect';
import matchers from '@testing-library/jest-dom/matchers'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import UserSummariesList from './index';



expect.extend(matchers);

describe('UserSummariesList', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders UserSummariesList', () => {
        render(
            <BrowserRouter>
                <UserSummariesList />
            </BrowserRouter>
        );

        const welcomeMessage = screen.getByText('Welcome');
        expect(welcomeMessage).toBeInTheDocument();
        const createButton = screen.getByText('Create new summary');
        expect(createButton).toBeInTheDocument();
    });

    it('redirects to "/summary" when "Create new summary" button is clicked', async () => {
        render(<>
            <MemoryRouter>
                <UserSummariesList />
            </MemoryRouter>

        </>
        );

        const createSummaryButton = screen.getByTestId('button');
        fireEvent.click(createSummaryButton);
        const paragraphElement = screen.getByText("Below is a list of all your summaries.")
        expect(paragraphElement).toBeInTheDocument()
    });

    // it('fetches and displays summaries', async () => {

    //     const originalGetUserID = window.getUserID;
    //     window.getUserID = () => 'test-user-id';


    //     const originalGetFirestore = window.getFirestore;
    //     window.getFirestore = () => ({
    //         collection: () => ({
    //             where: () => ({
    //                 get: async () => ({
    //                     docs: [{ id: '1', data: () => ({ title: 'Summary 1' }) }],
    //                 }),
    //             }),
    //         }),
    //     });

    //     render(<AuthProvider user={{ uid: 'test-user-id' }}><BrowserRouter><UserSummariesList /></BrowserRouter></AuthProvider>);


    //     await waitFor(() => {
    //         const summaryElement = screen.queryByText(/Summary 1/);
    //         console.log(summaryElement)
    //         expect(summaryElement).toBeInTheDocument();
    //     });


    //     window.getUserID = originalGetUserID;
    //     window.getFirestore = originalGetFirestore;
    // });
})
