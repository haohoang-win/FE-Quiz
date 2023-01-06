import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import _ from 'lodash';
import './ModalImage.scss'

const ModalViewQuiz = (props) => {
    const { dataQuiz, show, setShow, resetDataQuiz } = props;

    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [previewImage, setPreviewImage] = useState();

    useEffect(() => {
        if (!_.isEmpty(dataQuiz)) {
            // update state
            setName(dataQuiz.name);
            setDescription(dataQuiz.description);
            if (dataQuiz.imageB64) {
                setPreviewImage(dataQuiz.imageB64);
            }
        }
    }, [dataQuiz]);

    const handleClose = () => {
        setShow(false);
        resetDataQuiz();
        setName('');
        setDescription('');
        setPreviewImage('')
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
                    <Modal.Title>View a user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" disabled value={name} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Description</label>
                            <input type="email" className="form-control" disabled value={description} />
                        </div>
                        <div className='col-md-12 img-preview'>
                            {previewImage ?
                                <img src={previewImage} />
                                :
                                <span>Preview Image</span>
                            }
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

export default ModalViewQuiz;