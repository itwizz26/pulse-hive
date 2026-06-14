import './globals.css';

export const metadata = {
    title: 'PulseHive Admin',
    description: 'Admin dashboard for order & payment management',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
            <div className="layout">
            <nav className="navbar">
                <div className="logo-container">
                <img src="/pulsehive-logo.svg" alt="PulseHive logo" className="logo-img" />
                <h1 className="logo">PulseHive Admin</h1>
                </div>
                <ul className="nav-links">
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/orders">Orders</a></li>
                <li><a href="/payments">Payments</a></li>
                <li><a href="/reconciliation">Reconciliation</a></li>
                <li><a href="/settings">Settings</a></li>
                </ul>
            </nav>
            <main className="container">
                {children}
            </main>
            </div>
        </body>
        </html>
    );
}
