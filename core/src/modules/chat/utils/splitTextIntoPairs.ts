/**
 * Разбивает строку на несколько частей с учетом максимальной и средней длины
 * @param text - Исходная строка для разбиения
 * @param maxLength - Максимальная длина части
 * @param avgLength - Средняя желаемая длина части
 * @returns Массив строк после разбиения
 */
export function splitTextIntoParts(text: string, maxLength: number, avgLength: number): string[] {
    // Проверка входных параметров
    if (maxLength <= 0 || avgLength <= 0 || avgLength > maxLength) {
        throw new Error('Некорректные параметры длины');
    }

    // Если строка короче средней длины, возвращаем её как есть
    if (text.length <= avgLength) {
        return [text];
    }

    // Находим все возможные точки разбиения (предложения)
    const sentenceEndings = [...text.matchAll(/[.!?]+\s+/g)].map(match => match.index! + match[0].length);

    // Находим все возможные точки разбиения (пробелы)
    const spacePositions = [...text.matchAll(/\s+/g)].map(match => match.index! + match[0].length);

    const result: string[] = [];
    let startPos = 0;

    while (startPos < text.length) {
        // Определяем случайную целевую длину (от 0.7*avgLength до 1.3*maxLength)
        const minTargetLength = Math.max(10, Math.floor(avgLength * 0.7));
        const maxTargetLength = Math.min(Math.floor(maxLength * 1.3), text.length - startPos);
        const targetLength = Math.min(
            maxTargetLength,
            Math.floor(minTargetLength + Math.random() * (maxLength - minTargetLength))
        );

        // Ищем подходящую точку разбиения
        let splitPos: number | null = null;

        // Сначала пытаемся найти конец предложения в пределах целевой длины
        const sentenceEndPos = sentenceEndings.find(pos =>
            pos > startPos && pos - startPos <= targetLength
        );

        if (sentenceEndPos) {
            // Если нашли удобный конец предложения, используем его
            splitPos = sentenceEndPos;
        } else {
            // Ищем ближайший пробел к целевой длине
            let closestSpace = -1;
            let minDiff = Number.MAX_VALUE;

            for (const spacePos of spacePositions) {
                if (spacePos > startPos && spacePos - startPos <= maxTargetLength) {
                    const diff = Math.abs((spacePos - startPos) - targetLength);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestSpace = spacePos;
                    }
                }
            }

            if (closestSpace !== -1) {
                splitPos = closestSpace;
            }
        }

        // Если не нашли подходящего места для разбиения, берем весь оставшийся текст
        if (splitPos === null) {
            result.push(text.substring(startPos).trim());
            break;
        }

        // Добавляем часть текста в результат
        result.push(text.substring(startPos, splitPos).trim());
        startPos = splitPos;
    }

    return result.filter(part => part.length > 0);
}
