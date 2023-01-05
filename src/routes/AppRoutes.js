import { Routes, Route } from 'react-router-dom'
import Home from '../components/home/Home'
import AddNewUser from '../components/user/AddNewUser'

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/add-user' element={<AddNewUser />} />
            </Routes>
        </>
    )
}

export default AppRoutes