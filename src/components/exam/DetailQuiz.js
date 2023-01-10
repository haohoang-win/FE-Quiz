import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizById } from '../../redux/slice/quizSlice';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetailQuiz = (props) => {
    const params = useParams();
    const quizId = params.id;
    const dispatch = useDispatch();

    const quizIdRedux = useSelector(state => state.quiz.id)
    const detalQuiz = useSelector(state => state.quiz.detalQuiz)
    const isLoading = useSelector(state => state.quiz.isLoading)
    const isError = useSelector(state => state.quiz.isError)

    useEffect(() => {
        dispatch(fetchQuizById(quizId))
    }, [])

    if (quizIdRedux !== quizId) {
        return (
            <>
                Please select a quiz to do.
            </>
        )
    }


    return (
        <>
            <div className="detail-quiz-container">
                <div className="left-content">
                    <div className="title">
                        Quiz {quizId}
                    </div>
                    <hr />
                    <div className="q-body">
                        <img />
                    </div>
                    <div className="q-content">
                        <Question
                            handleCheckbox={handleCheckbox}
                            index={index}
                            data={dataQuiz && dataQuiz.length > 0 ? dataQuiz[index] : []}
                        />
                    </div>
                    <div className="footer">
                        <button className="btn btn-secondary" onClick={() => handlePrev()}>{t('detailquiz.prev')}</button>
                        <button className="btn btn-primary ml-3" onClick={() => handleNext()}>{t('detailquiz.next')}</button>
                        <button className="btn btn-warning ml-3" onClick={() => handleFinishQuiz()}>{t('detailquiz.finish')}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailQuiz;