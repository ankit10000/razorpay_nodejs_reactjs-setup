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
        <div className="canceled-container">
            <div className="card" style={{ textAlign: 'center', maxWidth: '600px' }}>
                <div className="error-icon">
                    ✕
                </div>
                <h1 style={{ color: '#ef4444', marginBottom: '15px' }}>Payment Cancelled</h1>
                <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.8', margin: '20px 0' }}>
                    Your payment has been cancelled. No charges were made to your account.
                </p>
                <div style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    margin: '25px 0'
                }}>
                    <p style={{ color: '#333', fontSize: '1rem' }}>
                        Redirecting to home page in{' '}
                        <span className="countdown">{countdown}</span>
                        {' '}seconds
                    </p>
                </div>
                <a href="/">
                    🏠 Return to Home
                </a>
            </div>
        </div>
    );
}
