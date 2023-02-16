import { useEffect, useState } from "react";
import { getAllClassWithSeason } from "../../services/classService";
import Select from "react-select";
import { getAllSchedule, postScheduleForClass } from "../../services/scheduleService";
import { useSelector } from "react-redux";
import _ from 'lodash'
import { toast } from "react-toastify";

const CreateTimetable = (props) => {
    const email = useSelector(state => state.user?.account?.email)
    const _id = useSelector(state => state.user?.account?._id)
    const weekNumber = useSelector(state => state.user.weekNumber)

    const [dataAllClass, setDataAllClass] = useState([])
    const [listClass, setListClass] = useState([])
    const [selectedClass, setSelectedClass] = useState('')
    const [dataAllSchedule, setDataAllSchedule] = useState([])
    const [arrListTime, setArrListTime] = useState(new Array(20).fill(null))
    const [arrNewSchedule, setArrNewSchedule] = useState([])
    const [arrInitSchedule, setArrInitSchedule] = useState([])

    const arrDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const arrTime = ['7:00-8:50', '9:00-10:50', '13:00-14:50', '15:00-16:50']

    useEffect(() => {
        fetchAllClass();
    }, [])

    useEffect(() => {
        if (selectedClass.value) {
            fetchAllSchedule(selectedClass.value);
            setArrNewSchedule([])
            setArrInitSchedule([])
        }
    }, [selectedClass])

    const fetchAllClass = async () => {
        let res = await getAllClassWithSeason(_id)
        if (res && res.EC === 0) {
            let listClassName = res.DT.map((item, index) => {
                return ({
                    label: `${index + 1} - ${item.name}`,
                    value: item._id
                })
            })
            setListClass(listClassName)
            setDataAllClass(res.DT)
        }
    }

    const fetchAllSchedule = async (idClass) => {
        let res = await getAllSchedule(idClass, weekNumber);
        if (res && res.EC === 0 && res.DT.length > 0) {
            const _arrListTime = new Array(20).fill(null)
            let arrCheck = []
            let arrNew = []
            arrTime.forEach((timeE, index) => {
                let lengthArrDay = arrDay.length
                arrDay.forEach((dayE, number) => {
                    let curNumber = index * lengthArrDay + number
                    let result = res.DT.filter(id => id.day === dayE && id.time === timeE)
                    if (result.length > 0) {
                        _arrListTime[curNumber] = result[0]
                        if (result[0].teacher === email) {
                            arrCheck.push(_arrListTime[curNumber])
                            arrNew.push({ day: _arrListTime[curNumber].day, time: _arrListTime[curNumber].time })
                            _arrListTime[curNumber] = { ..._arrListTime[curNumber], checkChoose: true }
                        } else {
                            _arrListTime[curNumber] = { ..._arrListTime[curNumber], checkChoose: false }
                        }
                    }
                })
            })
            setArrNewSchedule(arrNew)
            setArrInitSchedule(arrNew)
            setArrListTime(_arrListTime)
            setDataAllSchedule(res.DT)
        }
    }

    const handleAddSchedule = (index, day, time) => {
        if (arrNewSchedule.length < 2) {
            const _arrListTime = _.cloneDeep(arrListTime)
            _arrListTime[index] = { checkChoose: true, day, time }
            setArrListTime(_arrListTime);
            setArrNewSchedule([...arrNewSchedule, { day, time }])
        }
    }

    const handleRemoveSchedule = (index) => {
        const _arrListTime = _.cloneDeep(arrListTime)
        const _arrNewSchedule = _.cloneDeep(arrNewSchedule)
        _arrNewSchedule.find((item, number) => {
            if (item.time === _arrListTime[index].time && item.day === _arrListTime[index].day) {
                _arrNewSchedule.splice(number, 1)
                return true; // stop searching
            }
        });
        _arrListTime[index] = null
        setArrNewSchedule(_arrNewSchedule)
        setArrListTime(_arrListTime)
    }

    const handleSignUpTimeTable = async () => {
        const _arrNewSchedule = _.cloneDeep(arrNewSchedule)
        if (arrNewSchedule.length < 2) {
            toast.error('You must register for 2 lessons')
            return
        }
        const arrDeleteSchedule = arrInitSchedule.filter(({ day: day1, time: time1 }) => !arrNewSchedule.some(({ day: day2, time: time2 }) => day1 === day2 && time1 === time2));
        console.log(arrDeleteSchedule);
        arrDeleteSchedule.forEach(item => {
            item.weekNumber = weekNumber;
            item.season = '2022/2023';
            item.class = selectedClass.value;
            item.teacher = email;
        })
        _arrNewSchedule.forEach(item => {
            item.weekNumber = weekNumber;
            item.season = '2022/2023';
            item.class = selectedClass.value;
            item.teacher = email;
        })
        let data = { arrNewSchedule: _arrNewSchedule, arrDeleteSchedule }
        let res = await postScheduleForClass(data)
        if (res && res.EC === 0) {
            toast.success('Successful class schedule registration')
        }
    }

    return (
        <>
            <div className="createtable-container">
                <div className="title">Upsert Season</div>
                <form className="row g-3">
                    <div className="col-4"></div>
                    <div className="col-md-4">
                        <label className="form-label">Select Season</label>
                        <Select
                            value={selectedClass}
                            onChange={setSelectedClass}
                            options={listClass}
                        />
                    </div>
                    {selectedClass &&
                        <>
                            <div className="col-10 mt-5">
                                <table className="table table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Monday</th>
                                            <th scope="col">Tuesday</th>
                                            <th scope="col">Wednesday</th>
                                            <th scope="col">Thursday</th>
                                            <th scope="col">Friday</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {arrTime.map((time, index) => {
                                            let lengthArr = arrDay.length
                                            return (
                                                <tr>
                                                    <td>{time}</td>
                                                    {arrDay.map((day, number) => {
                                                        let curNumber = index * lengthArr + number
                                                        if (arrListTime[curNumber] === null) {
                                                            return (<td>
                                                                <div className={arrNewSchedule.length < 2 ? "btn btn-secondary" : "btn btn-secondary disabled"} onClick={() => handleAddSchedule(curNumber, day, time)}>Add</div>
                                                            </td>)
                                                        }
                                                        if (arrListTime[curNumber] !== null) {
                                                            if (arrListTime[curNumber].checkChoose) {
                                                                return (<td>
                                                                    <div className="btn btn-info" onClick={() => handleRemoveSchedule(curNumber)}>Del</div>
                                                                </td>)
                                                            } else {
                                                                return (<td>
                                                                    <div className="btn btn-danger disabled">Busy</div>
                                                                </td>)
                                                            }
                                                        }
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-2 symbol">
                                <div className="note">
                                    <span class="dot dot-1"></span>
                                    <span>&nbsp;&nbsp;Your schedule</span>
                                </div>
                                <div className="note">
                                    <span class="dot dot-2"></span>
                                    <span>&nbsp;&nbsp;Can't choose</span>
                                </div>
                                <div className="note">
                                    <span class="dot dot-3"></span>
                                    <span>&nbsp;&nbsp;Free</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="btn btn-warning" onClick={handleSignUpTimeTable}>Sign up</div>
                            </div>
                        </>
                    }
                </form>
            </div>
        </>
    )
}

export default CreateTimetable;