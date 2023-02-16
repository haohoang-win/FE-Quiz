import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

const ManageDatePicker = (props) => {
    const [selectDate, setSelectDate] = useState(new Date());
    const [stringDate, setStringDate] = useState('')
    var options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

    useEffect(() => {
        if (selectDate) {
            console.log(selectDate.toLocaleDateString("en-US", options));
            let currentDate = new Date()
            let startDate = new Date(currentDate.getFullYear(), 0, 1);
            var days = Math.floor((currentDate - startDate) /
                (24 * 60 * 60 * 1000));

            var weekNumber = Math.ceil(days / 7);
            console.log(weekNumber);
            // let dateSelected = selectDate.getDay() + '-' + selectDate.getDate() + "-" + parseInt(selectDate.getMonth() + 1) + "-" + selectDate.getFullYear();
            // setStringDate(dateSelected);
            // console.log(dateSelected);
        }
    }, [selectDate])

    return (
        <>
            <DatePicker
                selected={selectDate}
                onChange={(date) => setSelectDate(date)}
            />
        </>
    )
}

export default ManageDatePicker;