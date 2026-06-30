import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');

        if (!token) {
            router.push('/auth/login');
        } else {
            setIsAuthenticated(true);
            if (email) setUserEmail(email);
        }
    }, [router]);

    return { isAuthenticated, userEmail };
}