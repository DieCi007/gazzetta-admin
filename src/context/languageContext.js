const languageState = 'al';
const languageReducer = (state, action) => {
    switch (action) {
        case 'al':
            return 'al';
        case 'it':
            return 'it';
        case 'en':
            return 'en';
        default:
            return state;
    }
}

export { languageState, languageReducer }