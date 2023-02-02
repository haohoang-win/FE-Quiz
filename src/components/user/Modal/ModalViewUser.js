import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import _ from 'lodash';
import './ModalImage.scss'

const ModalViewUser = (props) => {
    const { dataUser, show, setShow, resetDataUser } = props;

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [role, setRole] = useState();
    const [previewImage, setPreviewImage] = useState();

    useEffect(() => {
        if (!_.isEmpty(dataUser)) {
            // update state
            setEmail(dataUser.email);
            setUsername(dataUser.username);
            setRole(dataUser.role);
            if (dataUser.imageB64) {
                setPreviewImage(dataUser.imageB64);
            }
        }
    }, [dataUser]);

    const handleClose = () => {
        setShow(false);
        resetDataUser();
        setEmail('');
        setUsername('');
        setRole('');
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
                        <div className="col-md-5">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" disabled value={username} />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" disabled value={email} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Role</label>
                            <input type="email" className="form-control" disabled value={role} />
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
    );
}

export default ModalViewUser;