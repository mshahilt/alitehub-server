const generateRandomString = () => {
    return Array(3)
        .fill(null)
        .map(() => Math.random().toString(36).substring(2, 5))
        .join("-");
};

export default generateRandomString;
