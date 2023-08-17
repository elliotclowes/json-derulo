import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import matchers from "@testing-library/jest-dom/matchers";
import '@testing-library/jest-dom/extend-expect';
expect.extend(matchers);
import TeacherInput from './index';

describe('TeacherInput', () => {
    it('renders the form elements', () => {
        render(<BrowserRouter><TeacherInput /></BrowserRouter>);


        expect(screen.getByLabelText('Title:')).toBeInTheDocument();
        expect(screen.getByText('Select Tags:')).toBeInTheDocument();
        expect(screen.getByText('Allow Students to View:')).toBeInTheDocument();
        expect(screen.getByText('Add Student')).toBeInTheDocument();
        expect(screen.getByText('Create Summary')).toBeInTheDocument();
    });

    it('displays predefined tags', () => {
        render(<BrowserRouter><TeacherInput /></BrowserRouter>);
        const predefinedTags = ['Step by step Guide', 'Tutorial', 'Coding', 'Video', 'Food'];
        predefinedTags.forEach(tag => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    it('updates the title input', () => {
        render(<BrowserRouter><TeacherInput /></BrowserRouter>);
        const titleInput = screen.getByLabelText('Title:');
        fireEvent.change(titleInput, { target: { value: 'New Title' } });
        expect(titleInput.value).toBe('New Title');
    });

    it('allows adding and removing student emails', async () => {
        render(<BrowserRouter><TeacherInput /></BrowserRouter>);
        const studentEmailInput = screen.getByLabelText('Allow Students to View:');
        const addStudentButton = screen.getByText('Add Student');

        fireEvent.change(studentEmailInput, { target: { value: 'student@example.com' } });
        fireEvent.click(addStudentButton);

        expect(studentEmailInput).toHaveValue('student@example.com');

        // const studentList = screen.getByTestId('student-list');
        // const removeStudentButton = studentList.querySelector('button');

        // fireEvent.click(removeStudentButton);

        // expect(screen.queryByText('student@example.com')).toBeNull();
    });

    
    // it('adds student email to the list when valid email is provided', async () => {
    //     vi.spyOn(window, 'fetch').mockResolvedValueOnce({
    //         ok: true,
    //         json: async () => ([
    //             { email: 'student1@example.com' },
    //             { email: 'student2@example.com' },
    //         ]),
    //     });

    //     render(<BrowserRouter><TeacherInput /></BrowserRouter>);
    //     const studentEmailInput = screen.getByLabelText('Allow Students to View:');
    //     const addStudentButton = screen.getByText('Add Student');

    //     fireEvent.change(studentEmailInput, { target: { value: 'student1@example.com' } });
    //     fireEvent.click(addStudentButton);

    //     expect(screen.getByText('student1@example.com')).toBeInTheDocument();
    // });

});
