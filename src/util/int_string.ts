export class IntString {
    // these should always be 1:1
    string_map: Map<number, string>;
    int_map: Map<string, number>;
    seq: number;

    constructor() {
        this.string_map = new Map<number, string>();
        this.int_map = new Map<string, number>();
        this.seq = 0;
    }

    set(id: number, s: string): void {
        this.string_map.set(id, s);
        this.int_map.set(s, id);
    }

    id_array(): number[] {
        return [...this.string_map.keys()];
    }

    get_or_make(s: string): number {
        const id = this.int_map.get(s);
        if (id) {
            return id;
        }
        this.seq += 1;
        this.string_map.set(this.seq, s);
        this.int_map.set(s, this.seq);
        return this.seq;
    }

    get_string(id: number): string | undefined {
        return this.string_map.get(id);
    }

    get_int(s: string): number | undefined {
        return this.int_map.get(s);
    }
}
