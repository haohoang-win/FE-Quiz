import { useEffect, useState } from "react";
import Select from "react-select";
import { getAllQuiz, getAnswerById, postQuestionForQuiz } from "../../services/quizServices";
import Button from 'react-bootstrap/Button';
import _ from 'lodash'
import ModalViewImage from "./Modal/ModalViewImage";
import { toast } from 'react-toastify';
import { postAnswer, putAnswer } from "../../services/answerServices";
import { postAnswerForQuestion, postQuestion } from "../../services/questionService";

const UpsertQuiz = (props) => {
    const [listQuiz, setListQuiz] = useState();
    const [allQuizName, setAllQuizName] = useState({});
    const [selectedQuiz, setSelectedQuiz] = useState();
    const [dataSelectedQuiz, setDataSelectedQuiz] = useState();

    const [dataPreviewImage, setDataPreviewImage] = useState('');
    const [isPreviewImage, setIsPreviewImage] = useState(false);

    let dataFakeQuestion = {
        _id: 'fakeQ',
        description: '',
        image: '',
        imageB64: '',
        difficulty: '',
        answers: [
            {
                _id: 'fakeA',
                description: '',
                isCorrect: false
            }
        ]
    }

    let dataFakeAnswer = {
        _id: 'fakeA',
        description: '',
        isCorrect: false
    }

    useEffect(async () => {
        await fetchAllQuiz()
    }, [])

    useEffect(() => {
        if (listQuiz && selectedQuiz && selectedQuiz.value) {
            let result = listQuiz.filter((item) => {
                if (item._id === selectedQuiz.value) {
                    return item;
                }
            })
            if (result[0].questions && result[0].questions.length === 0) {
                result[0].questions.push(dataFakeQuestion)
            }
            setDataSelectedQuiz(result[0]);
        }
    }, [selectedQuiz])

    const fetchAllQuiz = async () => {
        let res = await getAllQuiz();
        if (res && res.EC === 0) {
            let listQuizName = res.DT.map((item, index) => {
                return ({
                    label: `${index + 1} - ${item.name}`,
                    value: item._id
                })
            })
            setListQuiz(res.DT)
            setAllQuizName(listQuizName)
        }
    }

    const handleChangeText = (question, value, answer) => {
        let dataSelectedQuizClone = _.cloneDeep(dataSelectedQuiz);
        if (question && !answer) {
            dataSelectedQuizClone.questions[question - 1].description = value
        } else {
            dataSelectedQuizClone.questions[question - 1].answers[answer - 1].description = value
        }
        setDataSelectedQuiz(dataSelectedQuizClone)
    }
    const handleChangeChecked = (question, answer) => {
        let dataSelectedQuizClone = _.cloneDeep(dataSelectedQuiz);
        dataSelectedQuizClone.questions[question].answers.map((item, index) => {
            if (index === answer) {
                return item.isCorrect = true
            } else {
                return item.isCorrect = false
            }
        })
        setDataSelectedQuiz(dataSelectedQuizClone)
    }

    const handleUploadImage = async (question, event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let dataSelectedQuizClone = _.cloneDeep(dataSelectedQuiz);
            let imageB64 = await toBase64(event.target.files[0])
            dataSelectedQuizClone.questions[question].image = event.target.files[0]
            dataSelectedQuizClone.questions[question].imageB64 = imageB64
            setDataSelectedQuiz(dataSelectedQuizClone)
        } else {
            // setPreviewImage('')
        }
    }

    const handleModalImage = (question) => {
        setDataPreviewImage(question.imageB64)
        setIsPreviewImage(true)
    }

    const handleAddRemoveQuestion = (type, question) => {
        let dataSelectedQuizClone = _.cloneDeep(dataSelectedQuiz);
        if (type === 'ADD') {
            dataSelectedQuizClone.questions = [...dataSelectedQuizClone.questions, dataFakeQuestion]
        }
        if (type === 'REMOVE') {
            dataSelectedQuizClone.questions.splice(question, 1)
        }
        setDataSelectedQuiz(dataSelectedQuizClone)
    }

    const handleAddRemoveAnswer = (type, question, answer) => {
        let dataSelectedQuizClone = _.cloneDeep(dataSelectedQuiz);
        if (type === 'ADD') {
            dataSelectedQuizClone.questions[question].answers = [...dataSelectedQuizClone.questions[question].answers, dataFakeAnswer]
        }
        if (type === 'REMOVE') {
            dataSelectedQuizClone.questions[question].answers.splice(answer, 1)
        }
        setDataSelectedQuiz(dataSelectedQuizClone)
    }

    const handleSubmitDetailQuiz = async () => {
        if (dataSelectedQuiz) {
            let dataSelectedQuizClone = _.cloneDeep(dataSelectedQuiz);
            let isValid;
            dataSelectedQuizClone.questions.map((question, index) => {
                if (question.description === '') {
                    isValid = true;
                    toast.error(`Question ${index + 1} must have description`);
                    return;
                }
                if (question.answers && question.answers.length < 2) {
                    isValid = true;
                    toast.error(`Question ${index + 1} must have at least 2 answers`);
                    return;
                }
                if (!(question.answers.some(answer => answer.isCorrect === true))) {
                    isValid = true;
                    toast.error(`Question ${index + 1} don't have answer`);
                    return;
                }
                if (question.answers.some(answer => answer.description === '')) {
                    isValid = true;
                    toast.error(`Answer of question ${index + 1} don't have description`);
                    return;
                }
            })
            if (isValid) {
                return;
            }

            const questions = dataSelectedQuizClone.questions;
            let arrayQuestion = [];
            for (let question of questions) {
                const answers = question.answers;
                let answerId = [];
                let answersDescription = [];
                for (let answer of answers) {
                    if (answer._id === 'fakeA') {
                        delete answer._id;
                        let res = await postAnswer(answer);
                        if (res && res.EC === 0) {
                            answerId.push(res.DT._id)
                            answersDescription.push(res.DT.description)
                        }
                    } else {
                        let res = await putAnswer(answer)
                        if (res && res.EC === 0) {
                            answerId.push(answer._id)
                            answersDescription.push(answer.description)
                        }
                    }
                }
                if (question._id === 'fakeQ') {
                    delete question._id;
                    question.answers = answerId
                    question.answersDescription = answersDescription
                    question.difficulty = dataSelectedQuiz.difficulty;
                    let res = await postQuestion(question);
                    if (res && res.EC === 0) {
                        arrayQuestion.push(res.DT._id)
                    }
                } else {
                    question.answers = answerId;
                    question.answersDescription = answersDescription;
                    question.type = 'AR-A';
                    if (!!question.image.name) {
                        let b64 = await toBase64(question.image);
                        question.imageB64 = b64;
                    }
                    let res = await postAnswerForQuestion(question)
                    if (res && res.EC === 0) {
                        arrayQuestion.push(res.DT._id)
                    }
                }
            }
            if (arrayQuestion.length > 0) {
                let res = await postQuestionForQuiz(dataSelectedQuiz._id, arrayQuestion)
                if (res && res.EC === 0) {
                    toast.success('succes');
                    await fetchAllQuiz();
                    setSelectedQuiz({});
                    setDataSelectedQuiz({})
                }
            }
        } else {
            toast.warning('Please choose a quiz')
        }
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    return (
        <>
            <div className="upsetquiz-container">
                <div className="title">Upsert Quiz</div>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Select Quiz</label>
                        <Select
                            value={selectedQuiz}
                            onChange={setSelectedQuiz}
                            options={allQuizName}
                        />
                    </div>
                    <div className="mt-2 col-md-12">
                        Edit questions:
                    </div>
                    {dataSelectedQuiz && dataSelectedQuiz.questions && dataSelectedQuiz.questions.length > 0
                        && dataSelectedQuiz.questions.map((question, index) => {
                            return (
                                <>
                                    <div className="mt-3 mb-1 col-md-12" key={`index - ${index}`}>
                                        Question {index + 1}
                                    </div>
                                    <div className="col-md-6 input-question">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Question ${index + 1}`}
                                            value={question.description}
                                            onChange={(event) => handleChangeText(index + 1, event.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2 file-upload-question">
                                        <label htmlFor={`image-${index}-${question.id}`}>
                                            <i className="fa-regular fa-image" />
                                        </label>&nbsp;
                                        <input
                                            id={`image-${index}-${question.id}`}
                                            type='file'
                                            onChange={(event) => handleUploadImage(index, event)}
                                            hidden
                                        />
                                        <span className="file-name">
                                            {question.image ?
                                                <span className="file-update" onClick={() => handleModalImage(question)}>
                                                    1 file is upload
                                                </span> :
                                                '0 file is upload'
                                            }
                                        </span>
                                        &nbsp;	&nbsp;
                                        <span > &nbsp;
                                            {/* <i
                                                className="fa-solid fa-circle-plus plus"
                                                onClick={() => handleAddRemoveQuestion('ADD')}
                                            /> */}
                                            <span className="plus" onClick={() => handleAddRemoveQuestion('ADD')}>A</span>
                                            {dataSelectedQuiz.questions && dataSelectedQuiz.questions.length > 1 &&
                                                <>
                                                    &nbsp;	&nbsp; &nbsp;
                                                    {/* <i className="fa-solid fa-circle-minus remove"
                                                        onClick={() => handleAddRemoveQuestion('REMOVE', index)}
                                                    /> */}
                                                    <span className="remove" onClick={() => handleAddRemoveQuestion('REMOVE', index)}>R</span>
                                                </>
                                            }
                                        </span >
                                    </div>
                                    {question.answers && question.answers.length > 0 &&
                                        question.answers.map((answer, number) => {
                                            return (
                                                <>
                                                    <div className="col-md-7 input-answer" key={`number - ${number}`}>
                                                        <input type='radio' name={`${index} - ${question.id}`} className="radio" checked={answer.isCorrect}
                                                            onChange={() => handleChangeChecked(index, number)}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="form-control input"
                                                            placeholder={`Answer ${number + 1}`}
                                                            value={answer.description}
                                                            onChange={(event) => handleChangeText(index + 1, event.target.value, number + 1)}
                                                        />
                                                    </div>
                                                    <div className="col-md-1 add-remove">
                                                        <div>
                                                            &nbsp;	&nbsp;&nbsp;	&nbsp; &nbsp;&nbsp;
                                                            {/* <i
                                                                className="fa-solid fa-circle-plus plus"
                                                                onClick={() => handleAddRemoveAnswer('ADD', index)}
                                                            /> */}
                                                            <span className="plus" onClick={() => handleAddRemoveAnswer('ADD', index)}>A</span>
                                                            {question.answers && question.answers.length > 1 &&
                                                                <>
                                                                    &nbsp;	&nbsp;
                                                                    {/* <i className="fa-solid fa-circle-minus remove"
                                                                        onClick={() => handleAddRemoveAnswer('REMOVE', index, number)}
                                                                    /> */}
                                                                    <span className="remove" onClick={() => handleAddRemoveAnswer('REMOVE', index, number)}>R</span>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </>
                            )
                        })
                    }
                </form>
                {dataSelectedQuiz && dataSelectedQuiz._id ?
                    <div className='btn-add-question mt-3'>
                        <Button variant="primary" onClick={handleSubmitDetailQuiz}>
                            Save
                        </Button>
                    </div>
                    :
                    <></>
                }
            </div>
            <ModalViewImage
                dataPreviewImage={dataPreviewImage}
                setDataPreviewImage={setDataPreviewImage}
                show={isPreviewImage}
                setShow={setIsPreviewImage}
            />
        </>
    )
}

export default UpsertQuiz