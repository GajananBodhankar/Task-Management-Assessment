import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthScreen } from './components/AuthScreen'
import { Dashboard } from './components/Dashboard'

const AppContent = () => {
  const { loading, token } = useAuth()

  if (loading) {
    return <main className="loading-screen">Loading TaskFlow...</main>
  }

  return token ? <Dashboard /> : <AuthScreen />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
