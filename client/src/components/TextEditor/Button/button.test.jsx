import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import {
    Button,
    EditorValue,
    Icon,
    Instruction,
    Menu,
    Portal,
    Toolbar,
} from './index';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button />);
    });
});

describe('EditorValue', () => {
    it('renders correctly', () => {
        render(<EditorValue value={{ document: { nodes: [{ text: 'Hello' }] } }} />);
    });
});

describe('Icon', () => {
    it('renders correctly', () => {
        render(<Icon />);
    });
});

describe('Instruction', () => {
    it('renders correctly', () => {
        render(<Instruction />);
    });
});

describe('Menu', () => {
    it('renders correctly', () => {
        render(<Menu />);

    });
});

describe('Portal', () => {
    it('renders correctly', () => {
        render(<Portal>Test Content</Portal>);

    });
});

describe('Toolbar', () => {
    it('renders correctly', () => {
        render(<Toolbar />);

    });
});
