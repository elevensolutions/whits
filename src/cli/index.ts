#!/usr/bin/env node

import {CLI} from './cli.js';
import {Watcher} from './watcher.js';

const cli = new CLI();
const watcher = await cli.watch();

if (!(watcher && watcher instanceof Watcher)) await cli.compile();
