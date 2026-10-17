'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getProfile } from '@/lib/api-client';
import { getInitials } from '@/lib/utils';

export function useUser(enabled = true) {
    const pathname = usePathname();

    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(enabled);
    const [checkedPath, setCheckedPath] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchUser() {
            setIsLoading(true);

            const token = localStorage.getItem('token');

            if (
                !enabled ||
                !token ||
                token === 'undefined' ||
                token === 'null'
            ) {
                setUser(null);
                setCheckedPath(pathname);
                setIsLoading(false);
                return;
            }

            try {
                const profile = await getProfile();

                if (cancelled) return;

                setUser({
                    ...profile,
                    initials: getInitials(
                        profile.displayName || profile.email
                    ),
                });
            } catch {
                if (cancelled) return;

                setUser(null);
            } finally {
                if (!cancelled) {
                    setCheckedPath(pathname);
                    setIsLoading(false);
                }
            }
        }

        fetchUser();

        return () => {
            cancelled = true;
        };
    }, [enabled, pathname]);

    // A route change immediately marks the previous session check stale.
    const sessionLoading = isLoading || checkedPath !== pathname;

    return {
        user,
        isLoading: sessionLoading,
    };
}
