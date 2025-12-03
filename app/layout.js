import './globals.css';

export const metadata = {
  title: 'Razorpay Payment Gateway',
  description: 'Payment integration with Razorpay',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
