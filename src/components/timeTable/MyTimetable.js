import { useEffect, useState } from "react";
import { getAllScheduleForStudent } from "../../services/scheduleService";
import { useSelector } from "react-redux";
import _ from 'lodash'

const MyTimetable = (props) => {
    const weekNumber = useSelector(state => state.user.weekNumber)

    const [dataAllSchedule, setDataAllSchedule] = useState([])
    const [arrListTime, setArrListTime] = useState([])

    const arrDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const arrTime = ['7:00-8:50', '9:00-10:50', '13:00-14:50', '15:00-16:50']

    useEffect(() => {
        if (weekNumber) {
            fetchAllSchedule();
        }
    }, [weekNumber])

    const fetchAllSchedule = async (idClass) => {
        let res = await getAllScheduleForStudent(weekNumber);
        if (res && res.EC === 0 && res.DT.length > 0) {
            const _arrListTime = new Array(20).fill(null)
            arrTime.forEach((timeE, index) => {
                let lengthArrDay = arrDay.length
                arrDay.forEach((dayE, number) => {
                    let curNumber = index * lengthArrDay + number
                    let result = res.DT.filter(id => id.day === dayE && id.time === timeE)
                    if (result.length > 0) {
                        _arrListTime[curNumber] = result[0]
                    }
                })
            })
            setArrListTime(_arrListTime)
            setDataAllSchedule(res.DT)
        }
    }

    return (
        <>
            <div className="mytimetable-container">
                <div className="title">My timetable</div>
                <form className="row g-3">
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
                                                        <div className="btn btn-secondary disabled">None</div>
                                                    </td>)
                                                } else {
                                                    return (<td>
                                                        <div className="btn btn-success" >Class</div>
                                                    </td>)
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
                            <span class="dot dot-4"></span>
                            <span>&nbsp;&nbsp;Have schedule</span>
                        </div>
                        <div className="note">
                            <span class="dot dot-5"></span>
                            <span>&nbsp;&nbsp;Free Time</span>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default MyTimetable;