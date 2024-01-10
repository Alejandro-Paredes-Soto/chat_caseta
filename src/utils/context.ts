import { createContext } from 'react';

export const TokenContext = createContext<any>({
    token: '',
    setToken: () => '',
    servidor: '',
    setServidor: () => ''
})