import './App.css'
import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import LoginPage from './LogiinForm/LoginForm'
import { FilesListPage } from './FilePage/FilesListPage'
import RegisterPage from './FilePage/RegisterPage/RegisterPage'
import { FilePage } from './FilePage/FilePage'
import AdminPage from './AdminPanel/AdminPage/AdminPage'
import { AdminUsersList } from './AdminPanel/AdminUsersList'
import { AdminUserPage } from './AdminPanel/AdminUserPage'


function App() {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path='/file/:fileId' element={<FilePage/>}/>
            <Route path='/user/:userId' element={<AdminUserPage/>}/>
            <Route path='/files/' element={<FilesListPage/>}/>
            <Route path='/register/' element={<RegisterPage/>}/>
            <Route path='/admin/' element={<AdminPage/>}/>
            <Route path='/users-list/' element={<AdminUsersList/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
