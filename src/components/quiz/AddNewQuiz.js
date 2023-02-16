import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { postNewQuiz } from '../../services/quizServices';
import { FaFileImport } from 'react-icons/fa'

const AddNewQuiz = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('EASY');
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0])
        } else {
            // setPreviewImage('')
        }
    }

    const handleSubmitCreateUser = async () => {
        if (!name) {
            toast.error('Invalid name!')
            return;
        }

        // convert image to base64
        let imageB64 = '';
        if (image) {
            imageB64 = await toBase64(image)
        }
        let data = await postNewQuiz(name, difficulty, description, image, imageB64)
        if (data && data.EC === 0) {
            toast.success(data.mes);
            setName('');
            setDifficulty('EASY')
            setDescription('');
            setImage('');
            setPreviewImage('');
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
            <div className='addnewuser-container'>
                <div className="title">Add new Quiz</div>
                <form className="row g-3">
                    <div className="col-md-5">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Difficulty</label>
                        <select className="form-select" onChange={(event) => setDifficulty(event.target.value)} value={difficulty}>
                            <option value="EASY">EASY</option>
                            <option value='MEDIUM'>MEDIUM</option>
                            <option value='HARD'>HARD</option>
                        </select>
                    </div>
                    <div className="col-md-8">
                        <label className="form-label">Description</label>
                        <textarea rows={'6'} type="text" className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} />
                    </div>
                    <div className='col-md-12'>
                        <label className="form-label label-upload" htmlFor='labelUpload'>
                            {/* <i className="fas fa-file-import"></i> */}
                            <FaFileImport /> Update file Image
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
                <div className='btn-add'>
                    <Button variant="primary" onClick={handleSubmitCreateUser}>
                        Save
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AddNewQuiz