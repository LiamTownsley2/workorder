export * from './commands';
export * from './events';
export * from './buttons';
export * from './questions';

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));