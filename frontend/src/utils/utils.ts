export function capitalize(str: string) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
    const set = new Set<T>([...arr1, ...arr2]);
    return set.size === arr1.length && set.size === arr2.length;
}

export function getMonthYear(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}`
}