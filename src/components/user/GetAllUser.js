import { useEffect, useState } from "react"
import { getUserByPage } from "../../services/userServices";
import ReactPaginate from "react-paginate";
import ModalViewUser from "./Modal/ModalViewUser";
import ModalEditUser from "./Modal/ModalEditUser";
import ModalDeleteUser from "./Modal/ModalDeleteUser";
import { debounce } from 'lodash';
import { useSelector } from "react-redux";

const GetAllUser = (props) => {
    const role = useSelector(state => state.user.account.role)
    const limit = 6;
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurentPage] = useState(1)
    const [totalPage, setTotalPage] = useState();
    const [dataUser, setDataUser] = useState();

    const [showModalViewUser, setShowModalViewUser] = useState(false)
    const [showModalEditUser, setShowModalEditUser] = useState(false)
    const [showModalDeleteUser, setShowModalDeleteUser] = useState(false)
    const [roleUser, setRoleUser] = useState('');
    const [dataGetEmail, setDataGetEmail] = useState('')

    useEffect(async () => {
        await fetchUserByPage(1, dataGetEmail, roleUser);
    }, [])

    useEffect(async () => {
        if (roleUser || dataGetEmail) {
            await searchDataUser()
        } else {
            fetchUserByPage(currentPage, dataGetEmail, roleUser);
        }
    }, [roleUser, dataGetEmail])

    const searchDataUser = debounce(async () => {
        await fetchUserByPage(currentPage, dataGetEmail, roleUser);
    }, 300)

    const fetchUserByPage = async (page, getEmail, roleUser) => {
        let res = await getUserByPage(page, limit, getEmail, roleUser);
        if (res.EC === 0) {
            setListUsers(res.DT);
            setTotalPage(res.totalPage);
            setCurentPage(page)
        }
    }

    const handlePageClick = (event) => {
        fetchUserByPage(+event.selected + 1, dataGetEmail, roleUser);
    }

    const handleClickButtonView = (user) => {
        setShowModalViewUser(true);
        setDataUser(user)
    }

    const handleClickButtonUpdate = (user) => {
        setShowModalEditUser(true);
        setDataUser(user)
    }

    const handleClickButtonDelete = (user) => {
        setShowModalDeleteUser(true)
        setDataUser(user)
    }

    const resetDataUser = () => {
        setDataUser({})
    }

    return (<>
        <div className="getalluser-container">
            <div className="title">All User</div>
            <div className="row">
                <div className="col-md-6">
                    <label className="form-label">Search Email:</label>
                    <input type="text" className="form-control" value={dataGetEmail} onChange={(event) => setDataGetEmail(event.target.value)} placeholder='Search user by email...' />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Filter Difficulty</label>
                    <select className="form-select" onChange={(event) => setRoleUser(event.target.value)} value={roleUser}>
                        <option value="">ALL</option>
                        <option value="STUDENT">STUDENT</option>
                        <option value='TEACHER'>TEACHER</option>
                        <option value='MANAGER'>MANAGER</option>
                    </select>
                </div>
            </div>
            <table className="table table-hover table-bordered mt-3">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 &&
                        listUsers.map((item, index) => {
                            return (
                                <tr key={`table-users-${index}`}>
                                    <td>{(limit * (currentPage - 1)) + (index + 1)}</td>
                                    <td>{item.username}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        <button
                                            onClick={() => handleClickButtonView(item)}
                                            className="btn btn-secondary"
                                        >
                                            View
                                        </button>
                                        {role === 'MANAGER' ?
                                            <>
                                                <button
                                                    className="btn btn-warning mx-3"
                                                    onClick={() => handleClickButtonUpdate(item)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleClickButtonDelete(item)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                            : <></>
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                    {
                        listUsers && listUsers.length === 0 &&
                        <tr>
                            <td colSpan='4'>Not found data</td>
                        </tr>
                    }
                </tbody>
            </table>
            <div className="user-pagination">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={totalPage}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                />
            </div>
            <ModalViewUser
                dataUser={dataUser}
                show={showModalViewUser}
                setShow={setShowModalViewUser}
                resetDataUser={resetDataUser}
            />
            <ModalEditUser
                dataUser={dataUser}
                show={showModalEditUser}
                setShow={setShowModalEditUser}
                resetDataUser={resetDataUser}
                fetchUserByPage={fetchUserByPage}
                currentPage={currentPage}
                dataGetEmail={dataGetEmail}
                roleUser={roleUser}
            />
            <ModalDeleteUser
                dataDelete={dataUser}
                show={showModalDeleteUser}
                setShow={setShowModalDeleteUser}
                resetDataUser={resetDataUser}
                fetchUserByPage={fetchUserByPage}
                dataGetEmail={dataGetEmail}
                roleUser={roleUser}
            />
        </div>
    </>)
}

export default GetAllUser;