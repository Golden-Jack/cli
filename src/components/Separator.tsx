import React from 'react';
import { Text, useStdout } from 'ink';

import { darkTheme } from '../utils/theme';

export const Sep = () => {
    const { stdout } = useStdout();
    const [cols, setCols] = React.useState(stdout.columns);

    React.useEffect(() => {
        const handler = () => setCols(stdout.columns);
        stdout.on('resize', handler);
        return () => { stdout.off('resize', handler); };
    }, []);

    return <Text bold color={darkTheme.GOLD}>{'─'.repeat(cols - 4)}</Text>;
};