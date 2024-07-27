import './App.css'
import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import LoginPage from './Login/Login'
import { FilesListPage } from './FilePage/FilesListPage'
import RegisterPage from './FilePage/RegisterPage/RegisterPage'
import { FilePage } from './FilePage/FilePage'


function App() {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path='file/:fileId' element={<FilePage/>}/>
            <Route path='/files/' element={<FilesListPage/>}/>
            <Route path='register/' element={<RegisterPage/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
