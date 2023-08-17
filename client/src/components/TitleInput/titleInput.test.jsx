import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import matchers from "@testing-library/jest-dom/matchers";
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import TitleInput from './index';

expect.extend(matchers);

describe('TitleInput Component', () => {
    it('renders form elements', () => {
        const { container } = render(<BrowserRouter><TitleInput /></BrowserRouter>);

        const titleInput = container.querySelector('input#title');
        const tagsLabel = screen.getByText('Select Tags:');
        const visibilityLabel = screen.getByText('Visibility:');
        const createButton = screen.getByText('Create Summary');

        expect(titleInput).toBeTruthy();
        expect(tagsLabel).toBeTruthy();
        expect(visibilityLabel).toBeTruthy();
        expect(createButton).toBeTruthy();
    });

    it('updates title input', () => {
        const { container } = render(<BrowserRouter><TitleInput /></BrowserRouter>);
        const titleInput = container.querySelector('input#title');

        fireEvent.change(titleInput, { target: { value: 'Test Title' } });

        expect(titleInput.value).toBe('Test Title');
    });

    // test('should select and deselect tags', () => {
    //     render(<BrowserRouter><TitleInput /></BrowserRouter>); // Render your component


    //     const userTags = ['Tag1', 'Tag2', 'Tag3'];


    //     const tagElements = screen.getAllByTestId('tag-element');

    //     fireEvent.click(tagElements[0]); // Select Tag1
    //     expect(tagElements[0]).toHaveClass('bg-blue-500 text-white');

    //     fireEvent.click(tagElements[0]); // Deselect Tag1
    //     expect(tagElements[0]).not.toHaveClass('bg-blue-500 text-white');
    // });

    // it('submits form', async () => {
    //     render(<BrowserRouter><TitleInput /></BrowserRouter>);
    //     const createButton = screen.getByText('Create Summary');

    //     fireEvent.click(createButton);


    //     await screen.findByText('Document written with ID:');
    //     const navigateMock = vi.spyOn(require('react-router-dom'), 'useNavigate');

    //     expect(navigateMock).toHaveBeenCalledWith('/summary/some-id');
    // });

})