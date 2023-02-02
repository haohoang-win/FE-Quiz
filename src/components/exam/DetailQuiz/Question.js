import _ from 'lodash'
import { useEffect, useState, useRef } from 'react';
import { getQuestion } from '../../../services/questionService';
import ModalViewImage from '../../quiz/Modal/ModalViewImage';

const Question = (props) => {
    const { arrQuestion, index, selected, handleCheckbox, showAnswers, dataResult } = props;
    const refInput = useRef([])

    const [isPreviewImage, setIsPreviewImage] = useState(false);
    const [dataPreviewImage, setDataPreviewImage] = useState()
    const [dataQuestion, setDataQuestion] = useState(false);
    const [checked, setChecked] = useState([])

    useEffect(() => {
        if (arrQuestion && arrQuestion[index]) {
            let id = arrQuestion[index];
            fetchDataQuestion(id)
        }
    }, [index])

    useEffect(() => {
        if (showAnswers && dataResult && dataResult.length > 0) {
            handleCheck()
        }
    }, [dataQuestion, showAnswers])

    const fetchDataQuestion = async (id) => {
        let res = await getQuestion(id)
        if (res && res.EC === 0) {
            setDataQuestion(res.DT)
        }
    }

    const handleCheck = () => {
        let data = [];
        for (let i = 0; i < dataQuestion.answerDescription.length; i++) {
            if (dataResult[index] === i) {
                data[i] = 1;
            }
            if (refInput.current[i].checked && dataResult[index] !== i) {
                data[i] = 2;
            }
            if (!refInput.current[i].checked && dataResult[index] !== i) {
                data[i] = 0
            }
        }
        setChecked(data)
    }

    if (_.isEmpty(dataQuestion)) {
        return (
            <></>
        )
    }

    return (
        <>
            {dataQuestion.image ?
                <div className='q-image'>
                    <img
                        style={{ cursor: 'pointer' }}
                        src={`${dataQuestion.imageB64}`}
                        onClick={() => setIsPreviewImage(true)}
                    />
                    {isPreviewImage === true &&
                        <ModalViewImage
                            dataPreviewImage={`${dataQuestion.imageB64}`}
                            show={isPreviewImage}
                            setShow={setIsPreviewImage}
                            setDataPreviewImage={setDataPreviewImage}
                        />
                    }
                </div>
                :
                <div className='q-image'></div>
            }
            <div className="question">Question {index + 1}: {dataQuestion.description}</div>
            <div className="answer">
                {dataQuestion.answerDescription && dataQuestion.answerDescription.length &&
                    dataQuestion.answerDescription.map((a, number) => {
                        return (
                            <div className="a-child" key={`answer-${number}`}>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`radio - ${index} - ${dataQuestion._id}`}
                                        checked={number === selected ? true : false}
                                        onChange={() => handleCheckbox(number)}
                                        disabled={showAnswers}
                                        ref={element => refInput.current[number] = element}
                                    />
                                    <label className="form-check-label">
                                        {dataQuestion.answerDescription[number]}&nbsp;&nbsp;
                                    </label>
                                    <span className='correct'>
                                        {showAnswers && checked[number] === 1 ?
                                            <i className="fa-solid fa-check"></i> : <></>
                                        }
                                    </span>
                                    <span className='wrong'>
                                        {showAnswers && checked[number] === 2 ?
                                            <i className="fa-solid fa-xmark"></i> : <></>
                                        }
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Question;