import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalResul = (props) => {
    const { show, setShow, dataResult, isSelected, setShowAnswers, handleGoToExam } = props;

    const [allQuestion, setAllQuestion] = useState();
    const [doQuestion, setDoQuestion] = useState();
    const [rightQuestion, setRightQuestion] = useState()

    useEffect(() => {
        if (dataResult && isSelected) {
            let number = isSelected.length
            let numberDo = 0;
            let numberRight = 0;
            if (dataResult.length === isSelected.length) {
                for (let i = 0; i < dataResult.length; i++) {
                    if (isSelected[i].selected !== -1) {
                        numberDo = numberDo + 1
                    }
                    if (isSelected[i].selected === dataResult[i]) {
                        numberRight = numberRight + 1
                    }
                }
            }
            setAllQuestion(number);
            setDoQuestion(numberDo);
            setRightQuestion(numberRight);
        }
    }, [dataResult])

    const handleComfirm = () => {
        setShow(false);
        setShowAnswers(true);
    }

    const handleClose = () => {
        setShow(false);
        handleGoToExam();
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Your results:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>The number of questions you have completed is: <b>{`${doQuestion}`}</b></div>
                    <div>The right number of your questions: <b>{`${rightQuestion}`}</b></div>
                    <div>Your score: <b>{`${rightQuestion}`}/{`${allQuestion}`}</b></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Go to my exam
                    </Button>
                    <Button variant="primary" onClick={handleComfirm}>
                        Show answers
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalResul;