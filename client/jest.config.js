module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/components/**/*.{test.js,test.jsx}'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};
