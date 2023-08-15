import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from "../../contexts";
import '@testing-library/jest-dom/extend-expect';
import matchers from '@testing-library/jest-dom/matchers'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


vi.mock('./index', async () => {
    const actual = await vi.importActual('./index');
    return {
      ...actual,
      UserSummariesList: actual.default // Assuming UserSummariesList is the default export
    };
  });
  

  import { UserSummariesList } from './index';

// Mocking Firebase Firestore functions
vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({
      collection: vi.fn(() => ({
        where: vi.fn(() => ({
          get: vi.fn(async () => ({
            docs: [
              {
                id: '1',
                data: () => ({
                  title: 'Summary 1',
                  tags: ['Tag 1', 'Tag 2'],
                  visibility: 'Public',
                  created: new Date(1630444800000), // September 1, 2021
                }),
              },
              {
                id: '2',
                data: () => ({
                  title: 'Summary 2',
                  tags: ['Tag 2', 'Tag 3'],
                  visibility: 'Private',
                  created: new Date(1640995200000), // January 1, 2022
                }),
              },
              // Add more mock data entries as needed
            ],
          })),
        })),
      })),
    })),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
  }));
  



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
    render(
      <>
        <MemoryRouter>
          <UserSummariesList />
        </MemoryRouter>
      </>
    );

    const createSummaryButton = screen.getByTestId('button');
    fireEvent.click(createSummaryButton);
    const paragraphElement = screen.getByText("Below is a list of all your summaries.")
    expect(paragraphElement).toBeInTheDocument();
  });

 // Test utils
 const renderWithSummaries = async (userId) => {

    const ui = render(
      <MemoryRouter> 
        <UserSummariesList />
      </MemoryRouter>, 
      {/* auth */}
    );
    
    const summaries = await fetchSummaries(userId);
  
    return {
      ...ui,
      summaries
    };
  }
  
  // Test code
  it('displays summaries', async () => {
  
    const userId = '1';
  
    const { summaries } = await renderWithSummaries(userId);
  
    // Log and assert on summaries
  
  });
  
  // Implement fetch summaries
  const fetchSummaries = async (userId) => {
    // Call API, return data
  };
  

});
