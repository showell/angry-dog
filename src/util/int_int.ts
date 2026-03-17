export class IntInt {
    // these are usually 1:many
    int_map: Map<number, number>;
    reverse_map: Map<number, Set<number>>;
    id2_values: Set<number>;

    constructor() {
        this.int_map = new Map<number, number>();
        this.reverse_map = new Map<number, Set<number>>();
        this.id2_values = new Set<number>();
    }

    size(): number {
        return this.int_map.size;
    }

    set(id1: number, id2: number): void {
        this.int_map.set(id1, id2);

        const set = this.reverse_get(id2);
        set.add(id1);
        this.reverse_map.set(id2, set);

        this.id2_values.add(id2);
    }

    get(id1: number): number | undefined {
        return this.int_map.get(id1);
    }

    reverse_get(id2: number): Set<number> {
        return this.reverse_map.get(id2) ?? new Set<number>();
    }

    get_id2_values(): Set<number> {
        return this.id2_values;
    }
}
