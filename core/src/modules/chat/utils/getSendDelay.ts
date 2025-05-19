/**
 * Преобразует первую букву строки в верхний регистр
 *
 * @param str - Исходная строка
 * @returns Строка с первой буквой в верхнем регистре
 */
function capitalizeFirstLetter(str: string): string {
    if (!str || str.length === 0) {
        return str;
    }

    // Используем регулярное выражение для поиска первого буквенного символа
    // Это работает с Unicode, включая буквы разных алфавитов
    const match = str.match(/\p{L}/u);

    // Если нет буквенных символов в строке, возвращаем её без изменений
    if (!match || match.index === undefined) {
        return str;
    }

    // Индекс первого буквенного символа
    const firstLetterIndex = match.index;

    // Символ, который нужно преобразовать в верхний регистр
    const letterToCapitalize = str[firstLetterIndex];

    // Создаем новую строку с прописной первой буквой
    return (
        str.slice(0, firstLetterIndex) +
        letterToCapitalize.toUpperCase() +
        str.slice(firstLetterIndex + 1)
    );
}


export const getSendDelay = ({
    messages,
}:{
    messages: string[]
}):{
    str: string,
    delayMs: number
}[] => {
    let currentDelay = 0;
    return messages.map((m) => ({
        str: capitalizeFirstLetter(m),
        delayMs: currentDelay = currentDelay + 300 * m.length,
    }));
};