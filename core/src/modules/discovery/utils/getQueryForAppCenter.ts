const ALPHABET = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '@', '$', '%', '^', '&', '*', ' '];

const getNextSymbol = ({
    currentSymbol,
}:{
    currentSymbol: string,
}):string => {
    const currentIndex = ALPHABET.findIndex((a) => a === currentSymbol);
    
    if (currentIndex < ALPHABET.length) {
        return ALPHABET[currentIndex + 1];
    } else {
        return ALPHABET[0];
    }
};

// Получение следующей комбинации по сравнению с prevQuery
export const getQueryForAppCenter = ({ prevQuery }: { prevQuery: string | undefined }): string => {
    if (prevQuery === undefined) {
        return 'a';
    }

    if (prevQuery.length === 1 && prevQuery !== ' ') {
        return getNextSymbol({
            currentSymbol: prevQuery,
        });
    }

    if (prevQuery === ' ') {
        return 'aa';
    }

    const firstSymbol = prevQuery[0];
    const lastSymbol = prevQuery[1];

    if (lastSymbol === ' ') {
        return getNextSymbol({
            currentSymbol: firstSymbol,
        }) + 'a';
    }

    return firstSymbol + getNextSymbol({
        currentSymbol: lastSymbol,
    });
};