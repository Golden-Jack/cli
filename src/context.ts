import fs from 'node:fs';
import envPaths from 'env-paths';

import { Settings } from './types/Settings';
import { UserData } from './types/UserData';
import { GameData } from './types/GameData';
import { Payload, SCHEMA_VERSION } from './types/Payload';

const paths = envPaths('golden-jack');

export class Context {
    private static instance: Context;

    private constructor(
        public settings: Settings,
        public profile: UserData,
        public saves: GameData[],
        public activeSave: GameData | null = null
    ) {}

    static init(settings: Settings, profile: UserData, saves: GameData[]): Context {
        Context.instance = new Context(settings, profile, saves);
        return Context.instance;
    }

    static get(): Context {
        if (!Context.instance) throw new Error('Context not initialized');
        return Context.instance;
    }

    // SAVES
    loadSave(id: string): GameData | null {
        const save = this.saves.find(s => s.id === id) ?? null;
        this.activeSave = save;
        return save;
    }

    unloadSave() {
        this.activeSave = null;
    }

    createSave(game: GameData) {
        this.saves = [...this.saves, game];
        this.persistSave(game);
        this.activeSave = game;
    }

    updateActiveSave(game: GameData) {
        this.activeSave = game;
        this.saves = this.saves.map(s => (s.id === game.id ? game : s));
        this.persistSave(game);
    }

    deleteSave(id: string) {
        this.saves = this.saves.filter(s => s.id !== id);
        if (this.activeSave?.id === id) this.activeSave = null;
        const filePath = `${paths.data}/${id}.json`;

        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`Failed to delete save ${id}`, err);
        }
    }

    private persistSave(game: GameData) {
        fs.mkdirSync(paths.data, { recursive: true });

        const payload: Payload<GameData> = {
            data: game,
            schemaVersion: SCHEMA_VERSION,
            savedAt: Date.now()
        }

        fs.writeFileSync(`${paths.data}/${game.id}.json`, JSON.stringify(payload, null, 4));
    }

    // SETTINGS
    updateSettings(settings: Partial<Settings>) {
        this.settings = { ...this.settings, ...settings };
        this.persistJson(`${paths.config}/settings.json`, this.settings);
    }

    // PROFILE
    updateProfile(profile: Partial<UserData>) {
        this.profile = { ...this.profile, ...profile };
        this.persistJson(`${paths.config}/profile.json`, this.profile);
    }

    private persistJson<T extends GameData | Settings | UserData>(filePath: string, data: T) {
        const dir = filePath.substring(0, filePath.lastIndexOf('/'));
        fs.mkdirSync(dir, { recursive: true });

        const payload: Payload<T> = {
            data,
            schemaVersion: SCHEMA_VERSION,
            savedAt: Date.now(),
        }

        fs.writeFileSync(filePath, JSON.stringify(payload, null, 4));
    }
}