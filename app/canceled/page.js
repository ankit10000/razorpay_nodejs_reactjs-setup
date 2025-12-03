'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Canceled() {
    const [countdown, setCountdown] = useState(3);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            router.push('/');
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [router]);

    return (
        <div>
            <h1>Payment Cancelled</h1>
            <p>Your payment has been cancelled. You will be redirected to the home page in {countdown} seconds.</p>
            <a href='/'> menu</a>
        </div>
    );
}
