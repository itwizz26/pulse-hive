
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');

        if (!token || token === 'undefined' || token === 'null') {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');

            router.replace('/auth/login');
            setIsChecking(false);
            return;
        }

        setUserEmail(email || '');
        setIsAuthenticated(true);
        setIsChecking(false);
    }, [router]);

    return {
        isAuthenticated,
        isChecking,
        userEmail,
    };
}
