import {  createContext } from 'react';
import { InfoGlobalI } from '../models/InfoGlobal.interface';

export const InfoGlobal = createContext<InfoGlobalI>({
    dataColonos: []
});



