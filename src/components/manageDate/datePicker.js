import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ManageDatePicker = (props) => {
    const [selectDate, setSelectDate] = useState(new Date());
    const [stringDate, setStringDate] = useState('')
    var options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

    useEffect(() => {
        if (selectDate) {
            console.log(selectDate.toLocaleDateString("en-US", options));
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