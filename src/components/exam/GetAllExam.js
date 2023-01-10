import { useEffect, useState } from "react";
import { getUserAndQuiz } from "../../services/userServices";
import Select from "react-select";
import './GetAllExam.scss'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addQuizId } from "../../redux/slice/quizSlice";

const GetAllExam = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [listUser, setListUser] = useState();
    const [dataListUser, setDataListUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [dataSelectedUser, setDataSelectedUser] = useState([]);

    useEffect(async () => {
        await fetchAllUser();
    }, [])

    useEffect(() => {
        if (listUser && selectedUser) {
            let result = listUser.map(item => {
                if (item._id === selectedUser.value) {
                    return item;
                }
            }).filter(item => item);
            setDataSelectedUser(result[0])
        }
    }, [selectedUser])

    const fetchAllUser = async () => {
        let res = await getUserAndQuiz();
        if (res && res.EC === 0) {
            let nameListUser = res.data.map((item, index) => {
                return ({
                    label: `${item.username} (${item.email})`,
                    value: item._id
                })
            })
            setDataListUser(nameListUser)
            setListUser(res.data)
        }
    }

    const handleDoQuiz = (quizId) => {
        navigate(`/quiz/${dataSelectedUser.quizzes[quizId]._id}`)
        dispatch(addQuizId(dataSelectedUser.quizzes[quizId]._id))
    }

    return (
        <>
            <div className="getallexam-container">
                <div className="title">To do exam</div>
                <form className="row g-3">
                    <div className="col-md-4" />
                    <div className="col-md-4">
                        <label className="form-label">Select User</label>
                        <Select
                            value={selectedUser}
                            onChange={setSelectedUser}
                            options={dataListUser}
                        />
                    </div>
                    <div className="col-md-12 list-quiz-container container">
                        {dataSelectedUser && dataSelectedUser.quizzes && dataSelectedUser.quizzes.length > 0 &&
                            dataSelectedUser.quizzes.map((quiz, index) => {
                                return (
                                    <div key={`${index}-quiz`} className="card" style={{ width: " 18rem" }}>
                                        {quiz.image &&
                                            <img src={`${quiz.imageB64}`} className="card-img-top" alt="..." />
                                        }
                                        <div className="card-body">
                                            <h5 className="card-title">Quiz {index + 1}</h5>
                                            <p className="card-text">{quiz.description}</p>
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
                        {dataSelectedUser && dataSelectedUser.quizzes && dataSelectedUser.quizzes.length === 0 &&
                            <div>
                                Bạn chưa có bài Quiz lúc này...
                            </div>
                        }
                        {dataSelectedUser.length === 0 &&
                            < div >
                                Bạn chưa chọn user để làm bài Quiz lúc này...
                            </div>
                        }
                    </div>
                </form>
            </div >
        </>
    )
}

export default GetAllExam;