import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { ThemeProvider } from 'styled-components'
import planReducer from './store/planReducer'
import { theme } from './styles/theme'
import App from './App.tsx'

// Redux store 생성
const store = createStore(
  planReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)

async function mountApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}

mountApp();