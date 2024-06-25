import './style/App.css'
import { Routes, Route } from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { Dashboard } from './pages/Dashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="798758996041-kg5p566oe0q5792ags2m2q6g99frvsf3.apps.googleusercontent.com">
        <header className='fixed p-5 flex gap-4'>
          <a className='p-3 pr-5 pl-5 rounded-full text-center bg-white' href="/">Home</a>
          <a className='p-3 pr-5 pl-5 rounded-full text-center bg-white' href="/dashboard">Dashboard</a>
        </header>
        <Routes>
          <Route exact path="/" element={<Homepage />}/>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  )
}

export default App


