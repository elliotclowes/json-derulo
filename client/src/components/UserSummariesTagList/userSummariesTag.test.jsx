import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserSummariesTagList from './index';

describe('UserSummariesTagList', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders UserSummariesTagList', () => {
        render(
            <BrowserRouter>
                <UserSummariesTagList />
            </BrowserRouter>
        );
    });
});