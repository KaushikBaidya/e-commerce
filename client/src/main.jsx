import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { Toaster } from './components/ui/sonner';
import './index.css';
import ScrollToTop from './ScrollToTop';
import store from './store/store';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    <Provider store={store}>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: '#1a1a1a',
            color: '#fff',
            borderRadius: '8px',
          },
          className: 'my-custom-toast',
          duration: 3000,
        }}
      />

      <App />
    </Provider>
  </BrowserRouter>
);
