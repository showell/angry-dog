type GetString = (id: number) => string;

export function alpha_sort(ids: number[], get_string: GetString): void {
    ids.sort((id1, id2) => {
        return get_string(id1).localeCompare(get_string(id2));
    });
}
