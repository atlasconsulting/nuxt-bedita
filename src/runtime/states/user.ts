import type { UserDataStore } from '../types';
import { useState } from '#imports';

export const useUserState = () => useState<UserDataStore | null>('user', () => null);
