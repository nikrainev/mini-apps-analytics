/**
 * Разделяет массив чисел на n частей и возвращает массив средних значений для каждой части.
 * @param numbers Исходный массив чисел
 * @param n Количество частей, на которые нужно разделить массив
 * @returns Массив средних значений длиной n
 */
export function calculateAverageOfSegments(numbers: number[], n: number): number[] {
    if (n <= 0) {
        throw new Error('Значение n должно быть положительным числом');
    }

    if (numbers.length === 0) {
        return Array(n).fill(0); // Возвращаем массив нулей, если входной массив пуст
    }
    
    const localNumbers = numbers.sort((a, b) => a - b);

    const result: number[] = [];
    const segmentSize = numbers.length / n;

    for (let i = 0; i < n; i++) {
        // Вычисляем начальный и конечный индексы для текущего сегмента
        const startIndex = Math.floor(i * segmentSize);
        const endIndex = Math.floor((i + 1) * segmentSize);

        // Получаем элементы текущего сегмента
        const segment = localNumbers.slice(startIndex, endIndex);

        // Вычисляем среднее значение для текущего сегмента
        const sum = segment.reduce((acc, val) => acc + val, 0);
        const average = segment.length > 0 ? sum / segment.length : 0;

        result.push(average);
    }

    return result;
}

// Примеры использования:
// console.log(calculateAveragesOfSegments([1, 2, 3, 4, 5, 6], 3)); // [1.5, 3.5, 5.5]
// console.log(calculateAveragesOfSegments([10, 20, 30, 40, 50], 2)); // [20, 40]
