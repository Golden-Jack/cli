import { GameData } from './GameData';
import { Settings } from './Settings';
import { UserData } from './UserData';

export const SCHEMA_VERSION: string = '1.0';

export interface Payload <Data extends UserData | GameData | Settings> {
    data: Data;
    schemaVersion: string;
    savedAt: number;
}