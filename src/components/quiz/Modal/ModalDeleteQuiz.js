import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { deleteQuiz } from '../../../services/quizServices';

const ModalDeleteQuiz = (props) => {
    const { show, setShow, dataDelete, fetchQuizByPage, resetDataQuiz } = props;

    const handleClose = () => {
        resetDataQuiz()
        setShow(false)
    };

    const handleSubmitDeleteQuiz = async () => {
        let data = await deleteQuiz(dataDelete._id)
        if (data && data.EC === 0) {
            toast.success(data.mes);
            await fetchQuizByPage(1)
            handleClose();
        }

        if (data && data.EC !== 0) {
            toast.error(data.mes)
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Comfirm Delete the Quiz?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete this user? Name = <b>{dataDelete && dataDelete.name ? dataDelete.name : ''}</b></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitDeleteQuiz}>
                        Comfirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteQuiz;