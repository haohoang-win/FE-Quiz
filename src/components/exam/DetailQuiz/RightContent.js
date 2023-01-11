import CountDown from "./CountDown";
import { useEffect, useRef } from "react";

const RightContent = (props) => {
    const { isSelected, handleSubmitQuiz, setIndex, curQuestion } = props;
    const refDiv = useRef([])

    useEffect(() => {
        setIndex(0);
    }, [])

    const onTimeUp = () => {
        handleSubmitQuiz();
    }

    const getClassQuestion = (isSelected, index) => {
        if (isSelected) {
            let isAnswered = isSelected.selected !== -1 ? true : false
            if (isAnswered) {
                return "question selected"
            }
            if (curQuestion > -1) {
                if (index === curQuestion) {
                    return "question clicked"
                }
            }
        }
        return "question"
    }

    const handleClickQuestion = (isSelected, index) => {
        setIndex(index);
        if (refDiv.current) {
            refDiv.current.forEach(item => {
                if (item && item.className === "question clicked") {
                    item.className = "question"
                }
            })
        }
        if (isSelected) {
            let isAnswered = isSelected.selected !== -1 ? true : false
            if (isAnswered) {
                return;
            }
        }
        refDiv.current[index].className = 'question clicked'
    }

    return (
        <>
            <div className="main-timer">
                <CountDown
                    onTimeUp={onTimeUp}
                />
            </div>
            <div className="main-question">
                {isSelected && isSelected.length > 0 &&
                    isSelected.map((item, index) => {
                        return (
                            <div
                                key={`question-abc-${index}`}
                                className={getClassQuestion(item, index)}
                                onClick={() => handleClickQuestion(item, index)}
                                ref={element => refDiv.current[index] = element}
                            >
                                {index + 1}
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default RightContent