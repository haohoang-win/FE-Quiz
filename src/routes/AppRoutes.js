import { Routes, Route } from 'react-router-dom'
import Home from '../components/home/Home'
import AddNewQuiz from '../components/quiz/AddNewQuiz'
import GetAllQuiz from '../components/quiz/GetAllQuiz'
import UpsertQuiz from '../components/quiz/UpsertQuiz'
import AddNewUser from '../components/user/AddNewUser'
import AddQuizForUser from '../components/user/AddQuizForUser'
import GetAllUser from '../components/user/GetAllUser'

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/add-user' element={<AddNewUser />} />
                <Route path='/users' element={<GetAllUser />} />
                <Route path='/quiz-user' element={<AddQuizForUser />} />
                <Route path='/add-quiz' element={<AddNewQuiz />} />
                <Route path='/quizzes' element={<GetAllQuiz />} />
                <Route path='/upsert-quiz' element={<UpsertQuiz />} />
            </Routes>
        </>
    )
}

export default AppRoutes