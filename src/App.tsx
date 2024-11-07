import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppContent } from '@/components/layout/AppContent';

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  );
}

export default App;