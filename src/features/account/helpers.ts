const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const arabicDigits = '٠١٢٣٤٥٦٧٨٩';

export function toEnglishDigits(value: string): string {
    return [...value].map((character) => {
        const persianIndex = persianDigits.indexOf(character);
        if (persianIndex >= 0) return String(persianIndex);
        const arabicIndex = arabicDigits.indexOf(character);
        return arabicIndex >= 0 ? String(arabicIndex) : character;
    }).join('');
}

export function normalizeIranianMobile(value: string): string {
    const digits = toEnglishDigits(value).replace(/\D/g, '');
    if (digits.startsWith('0098')) return `0${digits.slice(4, 14)}`;
    if (digits.startsWith('98')) return `0${digits.slice(2, 12)}`;
    return digits.slice(0, 11);
}

export function isValidIranianMobile(value: string): boolean {
    return /^09\d{9}$/.test(normalizeIranianMobile(value));
}

export function isValidOtp(value: string): boolean {
    return /^\d{5}$/.test(toEnglishDigits(value).replace(/\D/g, ''));
}
