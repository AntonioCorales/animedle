export function getRandomByArray<T>(items: T[]): T | null {
    if(items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
}