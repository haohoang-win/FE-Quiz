import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import _ from 'lodash';
import './ModalImage.scss'

const ModalViewImage = (props) => {
    const { dataPreviewImage, setDataPreviewImage, show, setShow } = props;

    useEffect(() => {

    }, [dataPreviewImage]);

    const handleClose = () => {
        setShow(false);
        setDataPreviewImage();
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size='xl'
                backdrop='static'
                className='modal-add-user'
            >
                <Modal.Header closeButton>
                    <Modal.Title>View Image Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className='col-md-12 img-preview'>
                            <img src={dataPreviewImage} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalViewImage;