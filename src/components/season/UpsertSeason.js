import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { getAllSeason } from "../../services/seasonServices";
import { getUserByPage } from "../../services/userServices";
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

const UpsertSeason = (props) => {
    const [allSelectSeason, setAllSelectSeason] = useState([])
    const [dataAllSelectSeason, setDataAllSelectSeason] = useState([])
    const [selectedSeason, setSelectedSeason] = useState('');
    const [dataSelectedSeason, setDataSelectedSeason] = useState({});

    const [allTeacher, setAllTeacher] = useState([]);
    const [dataAllTeacher, setDataAllTeacher] = useState([]);

    const fakeClass = {
        name: 'fakeClassName',
        teacher: [{
            _id: '',
        }]
    }

    const fakeGrade = {
        grade: 'fakeGrade',
        year: 'fakeYear',
        classes: [fakeClass]
    }

    useEffect(() => {
        fetchAllSeason();
        fetchAllTeacher();
    }, [])

    useEffect(() => {
        if (selectedSeason) {
            let result = dataAllSelectSeason.filter((item) => {
                if (item._id === selectedSeason.value) {
                    return item;
                }
            })
            if (result[0].grades.length === 0) {
                for (let i = 0; i < 3; i++) {
                    const _fakeGrade = _.cloneDeep(fakeGrade)
                    _fakeGrade._id = `fakeId-${uuidv4()}`;
                    result[0].grades.push(_fakeGrade)
                }
            }
            setDataSelectedSeason(result[0]);
        }
    }, [selectedSeason])

    console.log(dataSelectedSeason);

    const fetchAllSeason = async () => {
        let res = await getAllSeason();
        if (res && res.EC === 0) {
            let listSeasonName = res.DT.map((item, index) => {
                return ({
                    label: `${index + 1} - ${item.year}`,
                    value: item._id
                })
            })
            setDataAllSelectSeason(res.DT)
            setAllSelectSeason(listSeasonName)
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
            setDataAllTeacher(res.DT)
            setAllTeacher(listTeacher)
        } else {
            toast.error(res.EM)
        }
    }

    const handleChangeTeacher = (index, number, id) => {
        const _dataSelectedSeason = _.cloneDeep(dataSelectedSeason);
        _dataSelectedSeason.grades[index].classes[number].teacher[0]._id = id
        setDataSelectedSeason(_dataSelectedSeason)
    }

    const handleAddRemoveClass = (type, index) => {
        const _dataSelectedSeason = _.cloneDeep(dataSelectedSeason)
        if (type === 'A') {
            if (_dataSelectedSeason.grades[index].classes && _dataSelectedSeason.grades[index].classes.length > 0) {
                _dataSelectedSeason.grades[index].classes.push(fakeClass)
            }
        }
        if (type === 'R') {
            if (_dataSelectedSeason.grades[index].classes && _dataSelectedSeason.grades[index].classes.length === 1) {
                toast.error('Grade have at least 1 class')
                return;
            } else {
                _dataSelectedSeason.grades[index].classes.pop()
            }
        }
        setDataSelectedSeason(_dataSelectedSeason)
    }

    const handleChangeAndSaveSeason = () => {
        let dataUpload = validateSeason();
        // console.log(dataUpload);
    }

    const validateSeason = () => {
        let checkSameTeacher = true;
        const arrayIdTeacher = []
        let _dataSelectedSeason = _.cloneDeep(dataSelectedSeason)
        if (_dataSelectedSeason && _dataSelectedSeason.grades && _dataSelectedSeason.grades.length > 0) {
            _dataSelectedSeason.grades.forEach((gradeInfo, index) => {
                if (gradeInfo.grade === 'fakeGrade') {
                    gradeInfo.grade = index + 10;
                }
                if (gradeInfo.year === 'fakeYear') {
                    gradeInfo.year = _dataSelectedSeason.year;
                }
                if (gradeInfo.classes && gradeInfo.classes.length > 0) {
                    gradeInfo.classes.forEach((classInfo, number) => {
                        if (classInfo.name === 'fakeClassName') {
                            classInfo.name = `${index + 10}/${number + 1}`
                        }
                        if (classInfo.teacher[0]._id === '') {
                            toast.error(`Class ${index + 10}/${number + 1} dont select teacher`)
                            checkSameTeacher = false;
                        } else {
                            arrayIdTeacher.push(classInfo.teacher[0]._id)
                        }
                    })
                }
            })
        }
        if (checkSameTeacher) {
            for (let i = 0; i < arrayIdTeacher.length; i++) {
                let result = checkArrSameTeacher(arrayIdTeacher, arrayIdTeacher[i])
                if (result) {
                    toast.error(`Teacher at row ${result[0]} and  ${result[1]} is same`);
                    return;
                }
            }
        }
        console.log(_dataSelectedSeason);
        return _dataSelectedSeason;
    }

    const checkArrSameTeacher = (array, element) => {
        var counts = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] === element) {
                counts.push(i);
            }
        }
        return counts;
    }

    return (
        <>
            <div className="upsertseason-container">
                <div className="title">Upsert Season</div>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Select Season</label>
                        <Select
                            value={selectedSeason}
                            onChange={setSelectedSeason}
                            options={allSelectSeason}
                        />
                    </div>
                    <div className="col-6"></div>
                    {selectedSeason && dataSelectedSeason ?
                        <>
                            <div className="col-12">
                                {dataSelectedSeason && dataSelectedSeason.grades && dataSelectedSeason.grades.length > 0 &&
                                    dataSelectedSeason.grades.map((gradeInfo, index) => {
                                        return (
                                            <>
                                                <div>Grade {10 + index}:</div>
                                                {gradeInfo.classes && gradeInfo.classes.length > 0 &&
                                                    gradeInfo.classes.map((classInfo, number) => {
                                                        return (
                                                            <>
                                                                <div className="row mt-1">
                                                                    <div className="col-1">Class: {10 + index}/{number + 1}</div>
                                                                    <div className="col-4">
                                                                        Teacher: <Select
                                                                            options={allTeacher}
                                                                            onChange={(event) => handleChangeTeacher(index, number, event.value)}
                                                                        />
                                                                        {classInfo.teacher && classInfo.teacher.username && classInfo.teacher.email &&
                                                                            <div>{classInfo.teacher.username}</div>
                                                                        }
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <span className="btn btn-success" onClick={() => handleAddRemoveClass('A', index)}>Add</span>
                                                                        <span className="btn btn-danger" onClick={() => handleAddRemoveClass('R', index)}>Remove</span>
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
                            </div>
                            <div className="col-12">
                                <span className="btn btn-warning" onClick={handleChangeAndSaveSeason}>Change and Save</span>
                            </div>
                        </>
                        : <></>
                    }
                </form>
            </div>
        </>
    )
}

export default UpsertSeason;