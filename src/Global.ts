import type { ProgLang } from "./types";
import progLangBase from "./assets/prog-langs/base.json"
import progLangJoke from "./assets/prog-langs/joke.json"

export class Global {
    public static readonly pLangs: ProgLang[] = (() => {
        progLangBase.forEach((pl) => (pl as ProgLang).kind = "base");
        progLangJoke.forEach((pl) => (pl as ProgLang).kind = "joke");
        const langs = progLangBase.concat(progLangJoke) as ProgLang[];
        langs.sort((a, b) => a.name.localeCompare(b.name));
        return langs;
    })();
    
    public static readonly aocDayCount = 12;
    public static readonly storageKeyDays = "aoc2025";
}