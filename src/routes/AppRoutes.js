import { Routes, Route } from 'react-router-dom'
import Home from '../components/home/Home'
import AddNewQuiz from '../components/quiz/AddNewQuiz'
import GetAllQuiz from '../components/quiz/GetAllQuiz'
import AddNewUser from '../components/user/AddNewUser'
import GetAllUser from '../components/user/GetAllUser'

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/add-user' element={<AddNewUser />} />
                <Route path='/users' element={<GetAllUser />} />
                <Route path='/add-quiz' element={<AddNewQuiz />} />
                <Route path='/quizzes' element={<GetAllQuiz />} />
            </Routes>
        </>
    )
}

export default AppRoutes