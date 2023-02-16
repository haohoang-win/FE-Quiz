import { useState } from "react";
import { toast } from "react-toastify";
import { postNewSeason } from "../../services/seasonServices";
import DatePicker from "react-datepicker";

const AddNewSeason = (props) => {
    const [selectDate, setSelectDate] = useState(new Date());
    const [nameSeason, setNameSeason] = useState('');

    const validateSeason = (value) => {
        const arrSeason = value.split('/');
        if (arrSeason && arrSeason.length === 2) {
            if (+arrSeason[0] < 2020) {
                return 'Season must to start year after 2020'
            }
            if (+arrSeason[1] > 2100) {
                return 'Season must to end year before 2100'
            }
            if (+arrSeason[1] !== +arrSeason[0] + 1) {
                return 'The season must consist of 2 consecutive years'
            } else {
                return null;
            }
        } else {
            return 'season in the wrong format'
        }
    }

    const validateDatOfStart = () => {
        let options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        let day = selectDate.toLocaleDateString("en-US", options).split(', ');
        if (day[0] !== 'Monday') {
            toast.error('Day of start for this season must to MonDay');
            return null;
        } else {
            return 'ok';
        }
    }

    const handleCreateNewReason = async () => {
        let checkValidate = validateSeason(nameSeason);
        let checkDay = validateDatOfStart()
        if (checkValidate) {
            toast.error(checkValidate);
            return;
        }
        if (!checkDay) return;
        let data = {
            year: nameSeason,
            dayOfStart: selectDate.toString()
        }
        let res = await postNewSeason(data);
        if (res && res.EC === 0) {
            toast.success(res.EM)
        } else {
            toast.error(res.EM)
        }
    }

    return (
        <>
            <div>
                <div className="title">Add new Season</div>
                <form className="row g-3">
                    <div className="col-md-5">
                        <label className="form-label">Season</label>
                        <input type="text" className="form-control" value={nameSeason} onChange={(event) => setNameSeason(event.target.value)} />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label">Day Of Start</label>
                        <DatePicker
                            selected={selectDate}
                            onChange={(date) => setSelectDate(date)}
                        />
                    </div>
                </form>
                <div className="mt-3">
                    <button className="btn btn-success" onClick={handleCreateNewReason}>Create new season</button>
                </div>
            </div>
        </>
    )
}

export default AddNewSeason;