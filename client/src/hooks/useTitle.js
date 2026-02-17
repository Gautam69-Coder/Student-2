import { useEffect } from 'react';

export function useTitle(title) {
    useEffect(() => {
        const prevTitle = document.title;
        if (title) {
            document.title = `${title} | Student Hub`;
        }
        return () => {
            document.title = prevTitle;
        };
    }, [title]);
}
