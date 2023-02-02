import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import _ from 'lodash';
import './ModalImage.scss'
import { upsertUser } from '../../../services/userServices';
import { toast } from 'react-toastify';

const ModalEditUser = (props) => {
    const { dataUser, show, setShow, resetDataUser, fetchUserByPage, currentPage } = props;

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState();
    const [imageB64, setImageB64] = useState('')
    const [role, setRole] = useState('')

    useEffect(() => {
        if (!_.isEmpty(dataUser)) {
            // update state
            setEmail(dataUser.email);
            setUsername(dataUser.username);
            setImage(dataUser.image);
            setRole(dataUser.role);
            setImageB64(dataUser.imageB64)
            if (dataUser.imageB64) {
                setPreviewImage(dataUser.imageB64);
            }
        }
    }, [dataUser]);

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0])
        } else {
            // setPreviewImage('')
        }
    }

    const handleClose = () => {
        setShow(false);
        resetDataUser();
        setEmail('');
        setUsername('');
        setImage('');
        setPreviewImage('')
        setImageB64('');
        setRole('')
    }

    const handleSubmitUpsertUser = async () => {
        let dataUserClone = _.cloneDeep(dataUser);

        if (!username) {
            toast.error('Invalid username!');
            return;
        }

        dataUserClone.username = username;
        dataUserClone.role = role;

        if (image && !!image.name) {
            dataUserClone.image = image;
            let b64 = await toBase64(image);
            dataUserClone.imageB64 = b64;
        } else {
            delete dataUserClone.image;
            delete dataUserClone.imageB64;
        }
        let data = await upsertUser(dataUserClone);
        if (data && data.EC === 0) {
            toast.success(data.mes);
            await fetchUserByPage(currentPage)
            handleClose();
        }
        if (data && data.EC !== 0) {
            toast.error(data.mes)
        }
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    return (
        <>
            {/* <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>  */}

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
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" disabled value={email} />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" value={username} onChange={(event) => setUsername(event.target.value)} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Role</label>
                            <select className="form-select" onChange={(event) => setRole(event.target.value)} value={role}>
                                <option value="STUDENT">STUDENT</option>
                                <option value='TEACHER'>TEACHER</option>
                                <option value='MANAGER'>MANAGER</option>
                            </select>
                        </div>
                        <div className='col-md-12'>
                            <label className="form-label label-upload" htmlFor='labelUpload'>
                                <i className="fas fa-file-import"></i> Update file Image
                            </label>
                            <input type='file' hidden id='labelUpload' onChange={(event) => handleUploadImage(event)} />
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
                    <Button variant="primary" onClick={handleSubmitUpsertUser}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalEditUser;