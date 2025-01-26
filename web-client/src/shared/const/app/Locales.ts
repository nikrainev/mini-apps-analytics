export enum Locales {
    En = 'en',
    Ru = 'ru',
}

export enum LocalesNumbers {
    en = 1,
    ru = 2,
}

export const mapNumberOnStr = (localNumber:LocalesNumbers|null):Locales => {
    if (!localNumber) {
        return Locales.En;
    }
    switch (localNumber) {
        case LocalesNumbers.ru:
            return Locales.Ru;
        default:
            return Locales.En;
    }
};

export const mapStrOnNumber = (localStr:Locales):LocalesNumbers => {
    return LocalesNumbers[localStr] as unknown as number;
};