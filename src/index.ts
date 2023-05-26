import './setup';

import { initializeApi } from './api';
import { initializeBot } from './bot';
import { UsersStorage } from './bot/user/usersStorage';

const usersStorage = new UsersStorage();
initializeApi(usersStorage);
initializeBot(usersStorage);
