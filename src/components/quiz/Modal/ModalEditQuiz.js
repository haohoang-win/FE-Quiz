import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import _ from 'lodash';
import './ModalImage.scss'
import { upsertQuiz } from '../../../services/quizServices';
import { toast } from 'react-toastify';

const ModalEditQuiz = (props) => {
    const { dataQuiz, show, setShow, resetDataQuiz, fetchQuizByPage, currentPage } = props;

    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState();
    const [imageB64, setImageB64] = useState('')

    useEffect(() => {
        if (!_.isEmpty(dataQuiz)) {
            // update state
            setName(dataQuiz.name);
            setDescription(dataQuiz.description);
            setImage(dataQuiz.image);
            setImageB64(dataQuiz.imageB64)
            if (dataQuiz.imageB64) {
                setPreviewImage(dataQuiz.imageB64);
            }
        }
    }, [dataQuiz]);

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
        resetDataQuiz();
        setName('');
        setDescription('');
        setImage('');
        setPreviewImage('')
        setImageB64('');
    }

    const handleSubmitUpsertQuiz = async () => {
        let dataQuizClone = _.cloneDeep(dataQuiz);

        dataQuizClone.description = description

        if (!!image.name) {
            dataQuizClone.image = image;
            let b64 = await toBase64(image);
            dataQuizClone.imageB64 = b64;
        } else {
            delete dataQuizClone.image;
            delete dataQuizClone.imageB64;
        }
        let data = await upsertQuiz(dataQuizClone);
        if (data && data.EC === 0) {
            toast.success(data.mes);
            await fetchQuizByPage(currentPage)
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
                    <Modal.Title>View a quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" disabled value={name} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Description</label>
                            <input type="text" className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} />
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
                    <Button variant="primary" onClick={handleSubmitUpsertQuiz}>
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

export default ModalEditQuiz;