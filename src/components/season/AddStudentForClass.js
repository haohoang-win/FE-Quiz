import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllSeason } from "../../services/seasonServices";
import Select from "react-select";
import { getClassById, postStudentForClass } from "../../services/classService";
import { getUserStudent } from "../../services/userServices";
import _ from 'lodash'

const AddStudentForClass = (props) => {
    const [allSeason, setAllSeason] = useState([])
    const [dataAllSeason, setDataAllSeason] = useState([])
    const [selectedSeason, setSelectedSeason] = useState({})
    const [dataAllClass, setDataAllClass] = useState([])
    const [dataAllStudent, setDataAllStudent] = useState([])
    const [dataSelectAllStudent, setDataSelectAllStudent] = useState([])
    const [selectedClass, setSelectedClass] = useState({})
    const [dataSelectedClass, setDataSelectedClass] = useState({})
    const [arrRemoveStudent, setArrRemoveStudent] = useState([])
    const [arrChangeStudent, setArrChangeStudent] = useState([])
    const [initArrStudent, setInitArrStudent] = useState([])

    useEffect(() => {
        fetchAllSeason();
        fetchAllUserStudent();
    }, [])

    useEffect(() => {
        if (selectedSeason.value) {
            let res = dataAllSeason.filter(item => item._id === selectedSeason.value)
            if (res && res[0].grades.length > 0) {
                let listClassName = [];
                res[0].grades.forEach((item, index) => {
                    item.classes.forEach((classInfo, number) => {
                        listClassName.push({
                            label: `${index * number + index + 1} - ${classInfo.name}`,
                            value: classInfo._id
                        })
                    })
                })
                setDataAllClass(listClassName);
                setSelectedClass({})
            } else {
                toast.error('This season dont have class')
                setDataAllClass([])
                setSelectedClass({})
            }
        }
    }, [selectedSeason]);

    useEffect(() => {
        if (selectedClass.value) {
            setArrRemoveStudent([])
            fetchClassById(selectedClass.value)
        }
    }, [selectedClass])

    const fetchClassById = async (id) => {
        let res = await getClassById(id)
        if (res && res.EC === 0) {
            let initArr = [];
            let _data = _.cloneDeep(res.DT);
            if (_data && _data.students && _data.students.length > 0) {
                _data.students.forEach((student) => {
                    if (student.imageB64) {
                        delete student.imageB64
                    }
                    initArr.push(student._id)
                })
            }
            setInitArrStudent(initArr)
            setDataSelectedClass(_data)
        } else {
            toast.error(res.EM)
        }
    }

    const fetchAllSeason = async () => {
        let res = await getAllSeason();
        if (res && res.EC === 0) {
            let listSeasonName = res.DT.map((item, index) => {
                return ({
                    label: `${index + 1} - ${item.year}`,
                    value: item._id
                })
            })
            setDataAllSeason(res.DT)
            setAllSeason(listSeasonName)
        } else {
            toast.error(res.EM)
        }
    }

    const fetchAllUserStudent = async () => {
        let res = await getUserStudent();
        if (res && res.EC === 0) {
            let listStudentName = res.DT.map((item, index) => {
                return ({
                    label: `${index + 1} - ${item.username} (${item.email})`,
                    value: item._id
                })
            })
            setDataSelectAllStudent(res.DT)
            setDataAllStudent(listStudentName);
        } else {
            toast.error(res.EM)
        }
    }

    const handleAddRemoveStudent = (type, index) => {
        let _dataSelectedClass = _.cloneDeep(dataSelectedClass)
        if (type === 'A') {
            _dataSelectedClass.students.push({ '_id': 'fakeId' })
        } else {
            if (_dataSelectedClass.students[index]._id !== 'fakeId' && _dataSelectedClass.students[index].email) {
                setArrRemoveStudent([...arrRemoveStudent, _dataSelectedClass.students[index]._id])
            }
            _dataSelectedClass.students.splice(index, 1)
        }
        setDataSelectedClass(_dataSelectedClass)
    }

    const handleSelectStudent = (value, index) => {
        let _dataSelectedClass = _.cloneDeep(dataSelectedClass)
        if (_dataSelectedClass.students[index]._id !== 'fakeId' && _dataSelectedClass.students[index].role) {
            delete _dataSelectedClass.students[index].role
            setArrChangeStudent([...arrChangeStudent, _dataSelectedClass.students[index]._id])
        }
        _dataSelectedClass.students[index]._id = value;
        setDataSelectedClass(_dataSelectedClass)
    }

    const handleSaveStudentForClass = async () => {
        let _dataSelectedClass = _.cloneDeep(dataSelectedClass)
        let result = validateStudent()
        if (result) {
            _dataSelectedClass.arrRemoveStudent = arrRemoveStudent;
            _dataSelectedClass.arrChangeStudent = arrChangeStudent;
            _dataSelectedClass.seasonId = selectedSeason.value;
            let res = await postStudentForClass(_dataSelectedClass)
            if (res && res.EC === 0) {
                toast.success(res.EM)
                fetchAllUserStudent();
                setArrRemoveStudent([])
                setArrChangeStudent([])
                setInitArrStudent([])
            } else {
                toast.error(res.EM)
            }
        }
    }

    const validateStudent = () => {
        let checkEmpty = dataSelectedClass.students.findIndex(s => s._id === 'fakeId');
        if (checkEmpty > -1) {
            toast.error(`Student at ${checkEmpty + 1} is empty`)
            return null;
        }
        for (let i = 0; i < dataSelectedClass.students.length; i++) {
            let result = checkArrSameStudent(dataSelectedClass.students, dataSelectedClass.students[i]._id)
            let checkExist = checkExistSeason(dataSelectedClass.students[i]._id);
            if (result && result[1]) {
                toast.error(`Student at row ${+result[0] + 1} and  ${+result[1] + 1} is same`);
            }
            if (checkExist) {
                toast.error(`Student at row ${i + 1} is exist in this season`);
            }
            if ((result && result[1]) || checkExist) return null;
        }
        return 'ok';
    }

    const checkArrSameStudent = (array, element) => {
        var counts = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i]._id === element) {
                counts.push(i);
            }
        }
        return counts;
    }

    const checkExistSeason = (id) => {
        let check = initArrStudent.includes(id);
        let value = false
        if (!check) {
            dataSelectAllStudent.map((student) => {
                if (student._id === id && !value) {
                    student.seasons.map(season => {
                        if (season === selectedSeason.value && !value) {
                            value = true;
                        }
                    })
                }
            })
        }
        return value;
    }

    return (
        <>
            <div className="upsertseason-container">
                <div className="title">Upsert Season</div>
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label">Select Season</label>
                        <Select
                            value={selectedSeason}
                            onChange={setSelectedSeason}
                            options={allSeason}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Select Class</label>
                        <Select
                            value={selectedClass}
                            onChange={setSelectedClass}
                            options={dataAllClass}
                        />
                    </div>
                    {selectedClass.value &&
                        <>
                            <div className="col-1"></div>
                            <div className="col-10 mt-5">
                                <table className="table table-hover table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col">STT</th>
                                            <th scope="col">Name And Email</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataSelectedClass && dataSelectedClass.students && dataSelectedClass.students.length > 0 ?
                                            dataSelectedClass.students.map((student, index) => {
                                                let value = dataAllStudent.find(o => o.value === student._id);
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <Select
                                                                value={value}
                                                                onChange={(event) => handleSelectStudent(event.value, index)}
                                                                options={dataAllStudent}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="btn btn-success" onClick={() => handleAddRemoveStudent('A')}>ADD</div>
                                                            <div className="btn btn-warning" onClick={() => handleAddRemoveStudent('R', index)}>REMOVE</div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            : <>
                                                <tr>
                                                    <td>1</td>
                                                    <td>
                                                        This class does not yet have students
                                                    </td>
                                                    <td>
                                                        <div className="btn btn-success" onClick={() => handleAddRemoveStudent('A')}>ADD</div>
                                                    </td>
                                                </tr>
                                            </>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-1 "></div>
                            <div className="col-1 "></div>
                            <div className="col-10 ">
                                <span className="btn btn-primary" onClick={handleSaveStudentForClass}>Save</span>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}
export default AddStudentForClass;