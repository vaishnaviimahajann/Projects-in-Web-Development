// Function jo check karta hai naam valid hai ya nahi
function isValidName(name) {
    if (!name || name.trim().length === 0) {
        return false;
    }
    return true;
}

module.exports = { isValidName };