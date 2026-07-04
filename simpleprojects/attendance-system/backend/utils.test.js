const { isValidName } = require('./utils');

test('valid name should return true', () => {
    expect(isValidName('Vaishnavi')).toBe(true);
});

test('empty name should return false', () => {
    expect(isValidName('')).toBe(false);
});

test('only spaces should return false', () => {
    expect(isValidName('   ')).toBe(false);
});

test('undefined name should return false', () => {
    expect(isValidName(undefined)).toBe(false);
});