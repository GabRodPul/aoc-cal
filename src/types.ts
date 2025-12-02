export type ProgLang = {
    name: string,
    code: string,
    refs: string[],
    kind: "base" | "joke"
}

export type AocDay = {
    lang: ProgLang;
    answer1: number;
    answer2: number;
}

export type AocYear = {
    dayCount: 12 | 25
}