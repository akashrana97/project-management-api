// app/ReduxProvider.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '../store'; // adjust if store is in a different folder

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
