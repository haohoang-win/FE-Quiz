import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Select from "react-select";
import { getUserStudent, postQuizForUser } from '../../services/userServices';
import { getAllQuiz } from '../../services/quizServices';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AddQuizForUser = (props) => {
    const role = useSelector(state => state.user.account.role)
    const [listUser, setListUser] = useState();
    const [dataListUser, setDataListUser] = useState([]);
    const [listQuiz, setListQuiz] = useState();
    const [dataListQuiz, setDataListQuiz] = useState([]);
    const [initDataListQuiz, setInitDataListQuiz] = useState();
    const [tempDataListQuiz, setTempDataListQuiz] = useState();

    const [selectedUser, setSelectedUser] = useState();
    const [dataSelectedUser, setDataSelectedUser] = useState();
    const [selectedQuiz, setSelectedQuiz] = useState();
    const [dataSelectedQuiz, setDataSelectedQuiz] = useState();
    const [filterDifficulty, setFilterDifficulty] = useState('ALL');

    useEffect(async () => {
        await fetchAllQuiz();
        await fetchAllUser();
    }, [])

    useEffect(() => {
        if (listUser) {
            let index = listUser.findIndex(item => item._id === selectedUser.value)
            if (index > -1) {
                setDataSelectedUser(listUser[index])
            }
            if (listUser[index] && listUser[index].quizzes && listUser[index].quizzes.length > 0 && listQuiz) {
                let newNameListQuiz = initDataListQuiz;
                for (let quizId of listUser[index].quizzes) {
                    newNameListQuiz = newNameListQuiz.filter(item => item.value !== quizId)
                }
                setFilterDifficulty('ALL')
                setDataListQuiz(newNameListQuiz)
                setTempDataListQuiz(newNameListQuiz)
            }
            if (listUser[index] && listUser[index].quizzes && listUser[index].quizzes.length === 0 && listQuiz) {
                setDataListQuiz(initDataListQuiz)
                setTempDataListQuiz(initDataListQuiz)
                setFilterDifficulty('ALL')
            }
        }
    }, [selectedUser])

    useEffect(() => {
        if (listQuiz && selectedQuiz) {
            let index = listQuiz.findIndex(item => item._id === selectedQuiz.value)
            if (index > -1) {
                setDataSelectedQuiz(listQuiz[index])
            }
        }
    }, [selectedQuiz])

    useEffect(() => {
        if (listQuiz) {
            let newArrayQuiz = listQuiz.map(item => {
                if (filterDifficulty !== 'ALL' && item.difficulty === filterDifficulty) {
                    return item._id;
                }
                if (filterDifficulty === 'ALL') {
                    return item._id;
                }
            }).filter(item => item)
            let newNameListQuiz = tempDataListQuiz.map(item => {
                if (newArrayQuiz.includes(item.value)) {
                    return item;
                }
            }).filter(item => item)
            setDataListQuiz(newNameListQuiz)
            if (filterDifficulty !== 'ALL' && dataSelectedQuiz && dataSelectedQuiz.difficulty !== filterDifficulty && selectedQuiz) {
                setSelectedQuiz({})
                setDataSelectedQuiz({})
            }
        }
    }, [filterDifficulty])

    const fetchAllQuiz = async () => {
        let res = await getAllQuiz()
        if (res && res.EC === 0) {
            let nameListQuiz = res.DT.map((item, index) => {
                return ({
                    label: `${index + 1} - ${item.name}`,
                    value: item._id
                })
            })
            setDataListQuiz(nameListQuiz)
            setInitDataListQuiz(nameListQuiz)
            setTempDataListQuiz(nameListQuiz)
            setListQuiz(res.DT)
        }
    }

    const fetchAllUser = async () => {
        let res = await getUserStudent();
        if (res && res.EC === 0) {
            let nameListUser = res.DT.map((item, index) => {
                return ({
                    label: `${item.username} (${item.email})`,
                    value: item._id
                })
            })
            setDataListUser(nameListUser)
            setListUser(res.DT)
        }
    }

    const handleAssignQuizForUser = async () => {
        if (!selectedUser) {
            toast.error('Please choose a user!')
            return;
        }

        if (!selectedQuiz) {
            toast.error('Please choose a quiz!')
            return;
        }
        let data = {
            type: 'AR-QZ',
            userId: dataSelectedUser._id,
            quizId: dataSelectedQuiz._id
        }
        data = JSON.parse(JSON.stringify(data));
        let res = await postQuizForUser(data)
        if (res && res.EC === 0) {
            toast.success('Assign succes!');
            let result = tempDataListQuiz.map(item => {
                if (item.value !== selectedQuiz.value) {
                    return item
                }
            }).filter(item => item);
            setDataListQuiz(result);
            setTempDataListQuiz(result);
            setFilterDifficulty('ALL')
            setSelectedQuiz({});
        }
        if (res && res.EC !== 0) {
            toast.error(res.mes);
        }
    }

    return (
        <>
            <div className='addquizforuser-container'>
                <div className="title">Add a Quiz for User</div>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>
                        <Select
                            value={selectedUser}
                            onChange={setSelectedUser}
                            options={dataListUser}
                        />
                    </div>
                    <div className="col-md-6">
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Select Quiz</label>
                        <Select
                            value={selectedQuiz}
                            onChange={setSelectedQuiz}
                            options={dataListQuiz}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Filter Difficulty</label>
                        <select className="form-select" onChange={(event) => setFilterDifficulty(event.target.value)} value={filterDifficulty}>
                            <option value="ALL">ALL</option>
                            <option value="EASY">EASY</option>
                            <option value='MEDIUM'>MEDIUM</option>
                            <option value='HARD'>HARD</option>
                        </select>
                    </div>
                </form>
                <div className='btn-add mt-4'>
                    <Button variant="warning" onClick={handleAssignQuizForUser}>
                        Assign
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AddQuizForUser;