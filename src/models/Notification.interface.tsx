export type NotificationI = {
    type: 'error' | 'info' | 'success' | 'warning';
    message: string;
    description: string;
    duration: number;
}