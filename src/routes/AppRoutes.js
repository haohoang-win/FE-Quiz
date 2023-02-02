import { Routes, Route } from 'react-router-dom'
import DetailQuiz from '../components/exam/DetailQuiz'
import GetAllExam from '../components/exam/GetAllExam'
import Home from '../components/home/Home'
import AddNewQuiz from '../components/quiz/AddNewQuiz'
import GetAllQuiz from '../components/quiz/GetAllQuiz'
import UpsertQuiz from '../components/quiz/UpsertQuiz'
import AddNewUser from '../components/user/AddNewUser'
import AddQuizForUser from '../components/user/AddQuizForUser'
import GetAllUser from '../components/user/GetAllUser'
import Login from '../components/login/Login'
import Register from '../components/register/Register'

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
                <Route path='/exams' element={<GetAllExam />} />
                <Route path='/quiz/:id' element={<DetailQuiz />} />
                <Route path='/quiz/:id' element={<DetailQuiz />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Routes>
        </>
    )
}

export default AppRoutes