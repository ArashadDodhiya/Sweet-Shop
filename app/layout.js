import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
    title: 'Sweet Shop Management System',
    description: 'Manage your sweets inventory',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-pink-50 min-h-screen">
                <Navbar />
                <main className="container mx-auto px-6 py-8">
                    {children}
                </main>
            </body>
        </html>
    );
}
