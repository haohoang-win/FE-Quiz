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
import NotFound from '../components/home/NotFound'
import { useSelector } from 'react-redux'
import DatePicker from '../components/manageDate/datePicker'
import AddNewSeason from '../components/season/AddNewSeason'
import UpsertSeason from '../components/season/UpsertSeason'

const AppRoutes = () => {
    const role = useSelector(state => state.user.account.role)
    return (
        <Routes>
            {role === 'MANAGER' ?
                <>
                    <Route path='/add-user' element={<AddNewUser />} />
                </>
                : <></>

            }
            {(role === 'MANAGER' || role === 'TEACHER') ?
                <>
                    <Route path='/users' element={<GetAllUser />} />
                    <Route path='/quiz-user' element={<AddQuizForUser />} />
                    <Route path='/add-quiz' element={<AddNewQuiz />} />
                    <Route path='/quizzes' element={<GetAllQuiz />} />
                    <Route path='/upsert-quiz' element={<UpsertQuiz />} />
                    {/* ------------------------- */}
                    <Route path='/add-season' element={<AddNewSeason />} />
                    <Route path='/upsert-season' element={<UpsertSeason />} />
                </>
                : <></>
            }
            {(role === 'MANAGER' || role === 'TEACHER' || role === 'STUDENT') ?
                <>
                    <Route path='/quiz/:id' element={<DetailQuiz />} />
                    <Route path='/exams' element={<GetAllExam />} />
                </>
                : <></>
            }
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/manage-date' element={<DatePicker />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes