export const notNullStrings = ({ 
    strings,
    joinSymbol,
}:{
    strings: (string | null | undefined)[],
    joinSymbol?: string
}) => {
    const filteredArr = strings.filter((s) => s);

    if (joinSymbol) {
        return filteredArr.join(`${joinSymbol} `);
    }

    return filteredArr.join(' ');
};
