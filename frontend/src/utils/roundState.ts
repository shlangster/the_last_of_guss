export function getRoundState(info: any) {
    if (!info) return { disabled: true, label: '' };
    
    const s = info.status;
    return {
        disabled: !isRoundActive(s),
        label: getRoundLabel(s)
    };
}

export function isRoundActive(status: string): boolean {
    return status === 'active';
}

export function getRoundLabel(status: string): string {
    switch (status) {
        case 'cooldown': return 'Скоро начнётся';
        case 'finished': return 'Завершён';
        case 'active': return 'Жми по гусю!';
        default: return '';
    }
}
