import { useState, useEffect } from 'react';
import { getProfile } from '@/lib/api-client';
import { getInitials } from '@/lib/utils';

export function useUser(enabled = true) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!enabled) return;

        async function fetchUser() {
            try {
                const profile = await getProfile();

                setUser({
                    ...profile,
                    initials: getInitials(
                        profile.displayName || profile.email
                    ),
                });
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        }

        fetchUser();
    }, [enabled]);

    return user;
}