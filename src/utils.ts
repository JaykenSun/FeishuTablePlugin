

export function string2Date(value: string) {

    const date = new Date(value);

    return date.getTime();
}