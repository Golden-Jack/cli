import fs from 'node:fs';

import { GameData } from '../types/GameData';
import { Payload, SCHEMA_VERSION } from '../types/Payload';
import { Settings } from '../types/Settings';
import { UserData } from '../types/UserData';

export function loadOrInit<T extends Settings | UserData>(
    dir: string,
    filename: string,
    defaultValue: T,
    label: string
): T {
    const filePath: string = `${dir}/${filename}`;

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const payload = JSON.parse(data) as Payload<T>;

        return payload.data;
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            console.info(`No ${label} found. Initializing...`);
            fs.mkdirSync(dir, { recursive: true });
            const payload: Payload<T> = {
                data: defaultValue,
                schemaVersion: SCHEMA_VERSION,
                savedAt: Date.now(),
            }
            fs.writeFileSync(filePath, JSON.stringify(payload, null, 4));

            return defaultValue;
        }

        console.error(`Failed to load ${label}`, err);

        return defaultValue;
    }
}

export function loadSaves(dir: string): GameData[] {
    try {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        return files.map(f => {
            const data = fs.readFileSync(`${dir}/${f}`, 'utf-8');
            const payload = JSON.parse(data) as Payload<GameData>;
            return payload.data;
        })
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
        console.error('Failed to load saves', err);
        return [];
    }
}