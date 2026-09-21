#!/usr/bin/env node

import envPaths, { Paths } from 'env-paths';

import { DEFAULT_SETTINGS, Settings } from './types/Settings';
import { DEFAULT_PROFILE, UserData } from './types/UserData';
import { GameData } from './types/GameData';

import { loadOrInit, loadSaves } from './utils/loader';
import { Context } from './context';

const paths: Paths = envPaths('golden-jack');

// LOAD SETTINGS
console.info('Loading settings...');
const settings: Settings = loadOrInit(paths.config, 'settings.json', DEFAULT_SETTINGS, 'settings');

// LOAD PROFILE
console.info('Loading profile...');
const profile: UserData = loadOrInit(paths.config, 'profile.json', DEFAULT_PROFILE, 'profile');

// LOAD SAVES
console.info('Loading saves...');
const saves: GameData[] = loadSaves(paths.data);

// LAUNCH APP
console.log('Initializing datas...');
Context.init(settings, profile, saves);

console.info('Launching app...');
const { launchApp } = await import('../app/app');

console.clear();
launchApp();