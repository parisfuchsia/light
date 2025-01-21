import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { HashRouter } from 'react-router-dom';
import store from './state/store.ts';
import { Provider } from 'react-redux';
createRoot(document.getElementById('root')!).render(
  <HashRouter>
      <StrictMode>
                <Provider store = {store}>
                  <App />
          </Provider >
  </StrictMode>,
  </HashRouter>
)
