import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { deleteUser } from '../../../services/userServices';

const ModalDeleteUser = (props) => {
    const { show, setShow, dataDelete, fetchUserByPage, resetDataUser } = props;

    const handleClose = () => {
        resetDataUser()
        setShow(false)
    };

    const handleSubmitDeleteUser = async () => {
        let data = await deleteUser(dataDelete._id)
        if (data && data.EC === 0) {
            toast.success(data.mes);
            await fetchUserByPage(1)
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
                    <Modal.Title>Comfirm Delete the User?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete this user? Email = <b>{dataDelete && dataDelete.email ? dataDelete.email : ''}</b></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitDeleteUser}>
                        Comfirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteUser;