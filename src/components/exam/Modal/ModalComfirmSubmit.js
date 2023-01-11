import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalComfirmSubmit = (props) => {
    const { show, setShow, handleSubmitQuiz } = props;

    const handleComfirm = () => {
        setShow(false);
        handleSubmitQuiz();
    }

    const handleClose = () => {
        setShow(false);
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Comfirm submit the Quiz?</Modal.Title>
                </Modal.Header>
                <Modal.Body>There's still time, are you sure to submit?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleComfirm}>
                        Comfirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalComfirmSubmit;