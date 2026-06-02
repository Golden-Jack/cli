export const canIncrease = (bet: number, playerBalance: number, max?: number): boolean => {
    return max
        ? bet < playerBalance && bet < max
        : bet < playerBalance
    ;
}