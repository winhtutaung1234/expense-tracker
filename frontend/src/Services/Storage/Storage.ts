class Storage {
    static setItem(key: string, value: any): void {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
    }

    static getItem<T>(key: string): T | null {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) as T : null;
    }

    static removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    static clear(): void {
        localStorage.clear();
    }
}

export default Storage;
