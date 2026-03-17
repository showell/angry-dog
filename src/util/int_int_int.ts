export class IntIntInt {
    map: Map<string, number>;
    id2_from_id1: Map<number, Set<number>>;
    ids_from_id1: Map<number, Set<number>>;
    id2_reverse_map: Map<number, number>;
    seq: number;

    constructor() {
        this.map = new Map<string, number>();
        this.id2_from_id1 = new Map<number, Set<number>>();
        this.ids_from_id1 = new Map<number, Set<number>>();
        this.id2_reverse_map = new Map<number, number>();
        this.seq = 0;
    }

    get_ids_from_id1(id1: number): number[] {
        const set = this.ids_from_id1.get(id1) ?? new Set<number>();
        return [...set];
    }

    get_id2_count(id1: number): number {
        return this.id2_from_id1.get(id1)?.size ?? 0;
    }

    get_id2(id: number): number | undefined {
        return this.id2_reverse_map.get(id);
    }

    get_or_make_id(id1: number, id2: number): number {
        const key = `${id1}-${id2}`;

        const id = this.map.get(key);

        if (id) {
            return id;
        }

        this.seq += 1;
        const new_id = this.seq;

        this.map.set(key, new_id);

        const id2_set = this.id2_from_id1.get(id1) ?? new Set();
        id2_set.add(id2);
        this.id2_from_id1.set(id1, id2_set);

        const id_set = this.ids_from_id1.get(id1) ?? new Set();
        id_set.add(new_id);
        this.ids_from_id1.set(id1, id_set);

        this.id2_reverse_map.set(new_id, id2);

        return new_id;
    }
}
