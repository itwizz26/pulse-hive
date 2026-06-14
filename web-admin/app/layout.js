import './globals.css';

export const metadata = {
    title: 'PulseHive | Premium Admin',
    description: 'Your modern and efficient platform for managing orders and payments.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
            <div className="layout">
                {/* Add Google Fonts or other premium fonts here */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <nav className="navbar">
                    <div className="logo-container">
                        <img src="/pulsehive-logo.svg" alt="PulseHive logo" className="logo-img" />
                        <h1 className="logo">PulseHive</h1>
                    </div>
                    <ul className="nav-links">
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/orders">Orders</a></li>
                        <li><a href="/payments">Payments</a></li>
                        <li><a href="/reconciliation">Reconciliation</a></li>
                        {/* Add or remove links as needed */}
                    </ul>
                </nav>
                <main className="container">
                    {children}
                </main>
            </div>
            {/* Scripts for enhanced interactivity could be added here */}
        </body>
        </html>
    );
}
