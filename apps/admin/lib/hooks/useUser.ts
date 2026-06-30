import { useState, useEffect } from 'react';
import { getProfile } from '@/lib/api-client';
import { getInitials } from '@/lib/utils';

export function useUser() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const profile = await getProfile();
                
                // Add the calculated initials to the profile object
                const userWithInitials = {
                    ...profile,
                    initials: getInitials(profile.displayName || profile.email)
                };
                
                setUser(userWithInitials);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        }
        fetchUser();
    }, []);

    return user;
}