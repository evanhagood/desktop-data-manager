export default {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    extensionsToTreatAsEsm: ['.jsx'],
    moduleNameMapper: {
        // Specific case for ../styles/Table.css
        '<rootDir>/src/styles/Table.css': 'identity-obj-proxy',

        // General case for all CSS/SCSS/LESS files
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
};
