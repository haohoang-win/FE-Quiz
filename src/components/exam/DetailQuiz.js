import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizById } from '../../redux/slice/quizSlice';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DetailQuiz.scss'
import Question from './DetailQuiz/Question';
import _ from 'lodash'
import RightContent from './DetailQuiz/RightContent';
import ModalComfirmSubmit from './Modal/ModalComfirmSubmit';
import { toast } from 'react-toastify';
import { submitQuiz } from '../../services/quizServices';
import ModalResul from './Modal/ModalResult';
import { useNavigate } from "react-router-dom";

const DetailQuiz = (props) => {
    const navigate = useNavigate()
    const params = useParams();
    const quizId = params.id;
    const dispatch = useDispatch();

    const quizIdRedux = useSelector(state => state.quiz.id)
    const detalQuiz = useSelector(state => state.quiz.detalQuiz)
    const isLoading = useSelector(state => state.quiz.isLoading)
    const isError = useSelector(state => state.quiz.isError)

    const [listQuestion, setListQuestion] = useState([]);
    const [curQuestion, setCurQuestion] = useState(0)
    const [isSelected, setIsSelected] = useState([]);

    const [showModalComfirmSubmit, setShowModalComfirmSubmit] = useState(false);
    const [showModalResult, setShowModalResult] = useState(false);
    const [dataResult, setDataResult] = useState()
    const [submitted, setSubmitted] = useState(false)
    const [showAnswers, setShowAnswers] = useState(false)

    useEffect(() => {
        dispatch(fetchQuizById(quizId))
    }, [])

    useEffect(() => {
        if (detalQuiz && detalQuiz.questions) {
            setListQuestion(detalQuiz.questions ? detalQuiz.questions : []);
            setCurQuestion(0)
        }
    }, [detalQuiz])

    useEffect(() => {
        if (listQuestion) {
            let arr = [];
            for (let question of listQuestion) {
                let data = {
                    'id': `${question}`,
                    'selected': -1
                }
                arr = [...arr, data]
            }
            setIsSelected(arr)
        }
    }, [listQuestion])

    if (quizIdRedux !== quizId) {
        return (
            <>
                <div className="detail-quiz-container">
                    <div className="title-more-info">
                        Please select a quiz to do.
                    </div>
                </div>
            </>
        )
    }

    if (isLoading === true && isError === false) {
        return (
            <>
                <div className="detail-quiz-container">
                    <div className="title-more-info">
                        Please wait for us to load the quiz.
                    </div>
                </div>
            </>
        )
    }

    const handleChooseQuestion = (action) => {
        if (action === 'NEXT' && curQuestion < listQuestion.length - 1) {
            setCurQuestion(curQuestion + 1);
        }
        if (action === 'PREV' && curQuestion > 0) {
            setCurQuestion(curQuestion - 1);
        }
    }

    const handleCheckbox = (number) => {
        let isSelectedClone = _.cloneDeep(isSelected)
        isSelectedClone[curQuestion].selected = number;
        setIsSelected(isSelectedClone)
    }

    const handleBtnClick = () => {
        if (!submitted) {
            setShowModalComfirmSubmit(true);
        } else {
            handleGoToExam()
        }
    }

    const handleGoToExam = () => {
        navigate(`/exams`)
    }

    const handleSubmitQuiz = async () => {
        if (!submitted) {
            let res = await submitQuiz(quizIdRedux)
            if (res && res.EC === 0) {
                toast.success(res.mes);
                setDataResult(res.DT)
                setShowModalResult(true)
                setSubmitted(true)
            }

            if (res && res.EC !== 0) {
                toast.error(res.mes);
            }
        }
    }

    return (
        <>
            <div className="detail-quiz-container">
                <div className="left-content">
                    <div className="title">
                        Quiz: {detalQuiz.description}
                    </div>
                    <hr />
                    <div className="q-content">
                        <Question
                            arrQuestion={listQuestion}
                            index={curQuestion}
                            selected={isSelected && isSelected.length > 0 ? isSelected[curQuestion].selected : -1}
                            handleCheckbox={handleCheckbox}
                            showAnswers={showAnswers}
                            dataResult={dataResult}
                        />
                    </div>
                    <div className="footer">
                        <button className="btn btn-secondary" onClick={() => handleChooseQuestion('PREV')} >Prev</button>
                        <button className="btn btn-primary ml-3" onClick={() => handleChooseQuestion('NEXT')}>Next</button>
                        <button className="btn btn-warning ml-3" onClick={handleBtnClick}>{!submitted ? 'Finish' : 'Go to my Exam'}</button>
                    </div>
                </div>
                <div className="right-content">
                    <RightContent
                        isSelected={isSelected && isSelected.length > 0 ? isSelected : []}
                        handleSubmitQuiz={handleSubmitQuiz}
                        setIndex={setCurQuestion}
                        curQuestion={curQuestion}
                    />
                </div>
            </div>
            <ModalComfirmSubmit
                show={showModalComfirmSubmit}
                setShow={setShowModalComfirmSubmit}
                handleSubmitQuiz={handleSubmitQuiz}
            />
            <ModalResul
                show={showModalResult}
                setShow={setShowModalResult}
                dataResult={dataResult}
                isSelected={isSelected}
                setShowAnswers={setShowAnswers}
                handleGoToExam={handleGoToExam}
            />
        </>
    )
}

export default DetailQuiz;