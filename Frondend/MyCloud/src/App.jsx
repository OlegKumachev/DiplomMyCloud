import './App.css'
import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import LoginPage from '../../Page/Login/Login'


function App() {
  return (
  <div>
    <Header/>
    <main>
      <Router>
         <Routes>
            <Route path="/login" component={<LoginPage/>}/>
        </Routes>
      </Router>
    </main>
  </div>
  )
}

export default App
