export enum darkTheme {
    GOLD = '#E6D289',
    TEXT = '#eeeeee',
    GRAY = '#2c2f33',
    RED = '#aa5555',
    GREEN = '#55aa55',
    BLUE = '#5555aa',
    HEART_DIAMOND = RED,
    CLUB_SPADE = TEXT,
}

export enum ThemeName {
    DARK = 'dark'
}

export interface ThemePalette {
    GOLD: string;
    TEXT: string;
    GRAY: string;
    RED: string;
    GREEN: string;
    BLUE: string;
    HEART_DIAMOND: string;
    CLUB_SPADE: string;
}

export const palettes: Record<ThemeName, ThemePalette> = {
    [ThemeName.DARK]: darkTheme
}