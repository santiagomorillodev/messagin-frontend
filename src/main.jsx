import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { WebSocketProvider } from './context/WebSocketContext.jsx'
import { CallProvider } from './context/CallContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <WebSocketProvider>
          <CallProvider>
            <App />
          </CallProvider>
        </WebSocketProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
