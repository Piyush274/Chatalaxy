import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, 
            //By default, refetchOnWindowFocus is true, meaning React Query will refetch the data every time the user switches back to the browser tab/window.
            //Any chnages here set changes to all queries
        },
    }
})

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>

    </BrowserRouter>,
)
