import './App.css'
import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { LoginPage } from './components/LoginForm/LoginForm'
import { RegisterPage } from './components/LoginForm/RegisterPage'
import { FilesListPage } from './components/FilePage/FilesListPage'
import { AdminPage } from './components/AdminPanel/AdminPage'
import { AdminUsersList } from './components/AdminPanel/AdminUsersList'
import { AdminUserPage } from './components/AdminPanel/AdminUserPage'
import { UserFilesPage } from './components/AdminPanel/UserFilesList'


function App() {
  return (
    <Router>
      <div className='app-container'>
        <Header />
        <main className='main-content'>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path='/user/:userId' element={<AdminUserPage/>}/>
            <Route path='/files/' element={<FilesListPage/>}/>
            <Route path='/register/' element={<RegisterPage/>}/>
            <Route path='/admin/' element={<AdminPage/>}/>
            <Route path='/users-list/' element={<AdminUsersList/>}/>
            <Route path="/user_files/:userId" element={<UserFilesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
