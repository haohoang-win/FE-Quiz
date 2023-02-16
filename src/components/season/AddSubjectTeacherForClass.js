import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllSeason } from "../../services/seasonServices";
import Select from "react-select";
import { getClassByIdWithTeacher, postObjectTeacherForClass } from "../../services/classService";
import { getUserByPage } from "../../services/userServices";
import _ from 'lodash'

const AddSubjectTeacherForClass = (props) => {
    const [allSeason, setAllSeason] = useState([])
    const [dataAllSeason, setDataAllSeason] = useState([])
    const [selectedSeason, setSelectedSeason] = useState({})
    const [dataAllClass, setDataAllClass] = useState([])
    const [dataAllTeacher, setDataAllTeacher] = useState([])
    const [dataSelectAllTeacher, setDataSelectAllTeacher] = useState([])
    const [selectedClass, setSelectedClass] = useState({})
    const [dataSelectedClass, setDataSelectedClass] = useState({})

    useEffect(() => {
        fetchAllSeason();
        fetchAllTeacher();
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
            fetchClassById(selectedClass.value)
        }
    }, [selectedClass])

    const fetchClassById = async (id) => {
        let res = await getClassByIdWithTeacher(id)
        if (res && res.EC === 0) {
            let initArr = [];
            let _data = _.cloneDeep(res.DT);
            if (_data && _data.teacherObject && _data.teacherObject.length > 0) {
                _data.teacherObject.forEach((student) => {
                    if (student.imageB64) {
                        delete student.imageB64
                    }
                    initArr.push(student._id)
                })
            }
            if (_data && _data.teacherObject && _data.teacherObject.length === 0 && res.DT && res.DT.teacher) {
                let fakeData = { '_id': res.DT.teacher[0], email: 'fakeEmail' }
                _data.teacherObject.push(fakeData)
            }
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

    const fetchAllTeacher = async () => {
        let res = await getUserByPage('', '', '', 'TEACHER')
        if (res && res.EC === 0) {
            let listTeacher = res.DT.map((item, index) => {
                return ({
                    label: `${index + 1} - ${item.username} (${item.email})`,
                    value: item._id
                })
            })
            setDataAllTeacher(listTeacher)
        } else {
            toast.error(res.EM)
        }
    }

    const handleAddRemoveTeacher = (type, index) => {
        let _dataSelectedClass = _.cloneDeep(dataSelectedClass)
        if (type === 'A') {
            _dataSelectedClass.teacherObject.push({ '_id': 'fakeId' })
        } else {
            _dataSelectedClass.teacherObject.splice(index, 1)
        }
        setDataSelectedClass(_dataSelectedClass)
    }

    const handleSelectTeacher = (value, index) => {
        let _dataSelectedClass = _.cloneDeep(dataSelectedClass)
        _dataSelectedClass.teacherObject[index]._id = value;
        setDataSelectedClass(_dataSelectedClass)
    }

    const handleSaveObjectTeacherForClass = async () => {
        let _dataSelectedClass = _.cloneDeep(dataSelectedClass)
        let result = validateTeacher()
        if (result) {
            _dataSelectedClass.teacherObject = _dataSelectedClass.teacherObject.map((teacher) => {
                return teacher._id
            })
            let res = await postObjectTeacherForClass(_dataSelectedClass)
            if (res && res.EC === 0) {
                toast.success(res.EM)
            } else {
                toast.error(res.EM)
            }
        }
    }

    const validateTeacher = () => {
        let checkEmpty = dataSelectedClass.teacherObject.findIndex(s => s._id === 'fakeId');
        if (checkEmpty > -1) {
            toast.error(`Teacher at ${checkEmpty + 1} is empty`)
            return null;
        }
        for (let i = 0; i < dataSelectedClass.teacherObject.length; i++) {
            let result = checkArrSameTeacher(dataSelectedClass.teacherObject, dataSelectedClass.teacherObject[i]._id)
            if (result && result[1]) {
                toast.error(`Student at row ${+result[0] + 1} and  ${+result[1] + 1} is same`);
                return null;
            }
        }
        return 'ok';
    }

    const checkArrSameTeacher = (array, element) => {
        var counts = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i]._id === element) {
                counts.push(i);
            }
        }
        return counts;
    }

    return (
        <>
            <div className="addsubject-container">
                <div className="title">Add Subject Teacher For Class</div>
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
                                            <th scope="col">Subject Teacher</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataSelectedClass && dataSelectedClass.teacher && dataSelectedClass.teacher.length > 0 &&
                                            <tr>
                                                <td>1</td>
                                                <td>
                                                    <input
                                                        value={dataAllTeacher.find(o => o.value === dataSelectedClass.teacher[0]).label}
                                                        className="form-control"
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <div className="btn btn-success" onClick={() => handleAddRemoveTeacher('A')}>ADD</div>
                                                </td>
                                            </tr>
                                        }
                                        {dataSelectedClass && dataSelectedClass.teacherObject && dataSelectedClass.teacherObject.length > 0 &&
                                            dataSelectedClass.teacherObject.map((teacher, index) => {
                                                let value = dataAllTeacher.find(o => o.value === teacher._id);
                                                if (index === 0 && teacher.email) {
                                                    return (<></>)
                                                } else {
                                                    return (
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <Select
                                                                    value={value}
                                                                    onChange={(event) => handleSelectTeacher(event.value, index)}
                                                                    options={dataAllTeacher}
                                                                />
                                                            </td>
                                                            <td>
                                                                <div className="btn btn-success btn-add" onClick={() => handleAddRemoveTeacher('A')}>ADD</div>
                                                                <div className="btn btn-warning" onClick={() => handleAddRemoveTeacher('R', index)}>REMOVE</div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-1 "></div>
                            <div className="col-1 "></div>
                            <div className="col-10 ">
                                <span className="btn btn-primary" onClick={handleSaveObjectTeacherForClass}>Save</span>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}
export default AddSubjectTeacherForClass;