import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;