export class BloomFilter {
    private bitArray: Uint8Array;
    private size: number;
    private hashCount: number;

    constructor(size: number, hashCount: number) {
        this.size = size;
        this.hashCount = hashCount;
        this.bitArray = new Uint8Array(Math.ceil(size / 8));
    }

    private hash(value: string, seed: number): number {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = (hash + seed * value.charCodeAt(i)) % this.size;
        }
        return hash;
    }

    add(value: string): void {
        for (let i = 0; i < this.hashCount; i++) {
            const hash = this.hash(value, i + 1);
            this.bitArray[Math.floor(hash / 8)] |= 1 << (hash % 8);
        }
    }

    contains(value: string): boolean {
        for (let i = 0; i < this.hashCount; i++) {
            const hash = this.hash(value, i + 1);
            if ((this.bitArray[Math.floor(hash / 8)] & (1 << (hash % 8))) === 0) {
                return false;
            }
        }
        return true;
    }
}