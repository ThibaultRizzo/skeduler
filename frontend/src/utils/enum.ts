export const getEnumKey = (enumObj: { [key: string]: string }, value: string): string => {
    const res = Object.entries(enumObj).find(([k, v]) => v === value);
    return res ? res[0] : "";
}