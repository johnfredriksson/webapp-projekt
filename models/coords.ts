const coords = {
    getCoords: function getCoords(dirtyString: string): Array<string> {
        const slicedString = dirtyString.slice(7, -1);
        const cleanString = slicedString.split((" "));

        return cleanString;
    },
};

export default coords;