import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
        <Header />
        <div className="flex min-h-screen">
          <main className="flex-1 px-4 pt-24 md:px-8">
            <AppRoutes />
          </main>
        </div>
        <Toaster />
      </div>
    </Router>
  );
}
export default App;