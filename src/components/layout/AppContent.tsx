import { useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AppRoutes } from '@/routes';

export function AppContent() {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <div className="relative min-h-screen bg-gray-50">
            {!isLandingPage && <Header />}
            <main className={`${!isLandingPage ? 'pt-20 px-4 md:px-8' : ''}`}>
                <AppRoutes />
            </main>
        </div>
    );
}