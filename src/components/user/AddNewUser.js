import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { postNewUser } from '../../services/apiServices'

const AddNewUser = (props) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState('')

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0])
        } else {
            // setPreviewImage('')
        }
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmitCreateUser = async () => {
        const isValidEmail = validateEmail(email)
        if (!username) {
            toast.error('Invalid username!')
            return;
        }
        if (!isValidEmail) {
            toast.error('Invalid email!')
            return;
        }
        let data = await postNewUser(username, email, image)
        console.log(data.EC);
        if (data && data.EC === 0) {
            toast.success(data.mes);
            setEmail('');
            setUsername('');
            setImage('');
            setPreviewImage('')
        }
        if (data && data.EC !== 0) {
            toast.error(data.mes)
        }
    }

    return (
        <>
            <div className='addnewuser-container'>
                <div className="title">Add new User</div>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={username} onChange={(event) => setUsername(event.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} />
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
                <div className='btn-add'>
                    <Button variant="primary" onClick={handleSubmitCreateUser}>
                        Save
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AddNewUser