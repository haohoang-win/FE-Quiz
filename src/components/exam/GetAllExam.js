import { useEffect, useState } from "react";
import { getUserAndQuiz } from "../../services/userServices";
import Select from "react-select";
import './GetAllExam.scss'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addQuizId } from "../../redux/slice/quizSlice";

const GetAllExam = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const role = useSelector(state => state.user.account.role)

    const [dataUser, setDataUser] = useState([])

    useEffect(async () => {
        await fetchUser();
    }, [])

    const fetchUser = async () => {
        let res = await getUserAndQuiz();
        if (res && res.EC === 0) {
            setDataUser(res.DT)
        }
    }

    const handleDoQuiz = (quizId, authorId) => {
        if (role === 'STUDENT') {
            navigate(`/quiz/${dataUser.quizzes[quizId]._id}`)
            dispatch(addQuizId(dataUser.quizzes[quizId]._id))
        }
        if (role === 'TEACHER') {
            navigate(`/quiz/${dataUser.authors[quizId]._id}`)
            dispatch(addQuizId(dataUser.authors[quizId]._id))
        }
        if (role === 'MANAGER') {
            navigate(`/quiz/${dataUser[authorId].authors[quizId]._id}`)
            dispatch(addQuizId(dataUser[authorId].authors[quizId]._id))
        }
    }

    return (
        <>
            <div className="getallexam-container">
                <div className="title mt-3">My Quizzes</div>
                <form className="row g-3 mt-1 listquiz">
                    <div className="col-md-12 list-quiz-container container">
                        {role === 'STUDENT' && dataUser && dataUser.quizzes && dataUser.quizzes.length > 0 &&
                            dataUser.quizzes.map((quiz, index) => {
                                return (
                                    <div key={`${index}-quiz`} className="card" style={{ width: " 18rem" }}>
                                        {quiz.image &&
                                            <img src={`${quiz.imageB64}`} className="card-img-top" alt="..." />
                                        }
                                        <div className="card-body">
                                            <h5 className="card-title">Quiz {index + 1}</h5>
                                            <p className="card-text">{quiz.description}</p>
                                            <p className="card-author">Author: {quiz?.author?.username}</p>
                                            <button
                                                onClick={() => handleDoQuiz(index)}
                                                className="btn btn-primary"
                                            >
                                                Start
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {role === 'TEACHER' && dataUser && dataUser.authors && dataUser.authors.length > 0 &&
                            dataUser.authors.map((quiz, index) => {
                                return (
                                    <div key={`${index}-quiz`} className="card" style={{ width: " 18rem" }}>
                                        {quiz.image &&
                                            <img src={`${quiz.imageB64}`} className="card-img-top" alt="..." />
                                        }
                                        <div className="card-body">
                                            <h5 className="card-title">Quiz {index + 1}</h5>
                                            <p className="card-text">{quiz.description}</p>
                                            <p className="card-author">Author: {quiz?.author?.username}</p>
                                            <button
                                                onClick={() => handleDoQuiz(index)}
                                                className="btn btn-primary"
                                            >
                                                Start
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {role === 'MANAGER' && dataUser && dataUser.length > 0 &&
                            dataUser.map((teacher, index) => {
                                if (teacher.authors.length > 0) {
                                    return (teacher.authors.map((quiz, number) => {
                                        return (
                                            <div key={`${(index * number) + number}-quiz`} className="card" style={{ width: " 18rem" }}>
                                                {quiz.image &&
                                                    <img src={`${quiz.imageB64}`} className="card-img-top" alt="..." />
                                                }
                                                <div className="card-body">
                                                    <h5 className="card-title">Quiz {(index * number) + number + 1}</h5>
                                                    <p className="card-text">{quiz.description}</p>
                                                    <p className="card-author">Author: {quiz?.author?.username}</p>
                                                    <button
                                                        onClick={() => handleDoQuiz(number, index)}
                                                        className="btn btn-primary"
                                                    >
                                                        Start
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }))
                                }
                            })
                        }
                        {role === 'STUDENT' && dataUser && dataUser.quizzes && dataUser.quizzes.length === 0 &&
                            <div>
                                Bạn chưa có bài Quiz lúc này...
                            </div>
                        }
                    </div>
                </form>
            </div >
        </>
    )
}

export default GetAllExam;