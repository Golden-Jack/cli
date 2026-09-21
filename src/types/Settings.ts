import { ThemeName } from '../../app/utils/theme';

export interface Settings {
    favoriteBet: number,
    theme: ThemeName;
}

export const DEFAULT_SETTINGS: Settings = {
    favoriteBet: 50,
    theme: ThemeName.DARK
}