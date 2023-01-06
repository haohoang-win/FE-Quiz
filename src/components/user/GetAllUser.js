import { useEffect, useState } from "react"
import { getUserByPage } from "../../services/userServices";
import ReactPaginate from "react-paginate";
import ModalViewUser from "./Modal/ModalViewUser";
import ModalEditUser from "./Modal/ModalEditUser";
import ModalDeleteUser from "./Modal/ModalDeleteUser";

const GetAllUser = (props) => {
    const limit = 6;
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurentPage] = useState(1)
    const [totalPage, setTotalPage] = useState();
    const [dataUser, setDataUser] = useState();

    const [showModalViewUser, setShowModalViewUser] = useState(false)
    const [showModalEditUser, setShowModalEditUser] = useState(false)
    const [showModalDeleteUser, setShowModalDeleteUser] = useState(false)

    useEffect(async () => {
        await fetchUserByPage(1);
    }, [])

    const fetchUserByPage = async (page) => {
        let res = await getUserByPage(page, limit);
        if (res.EC === 0) {
            setListUsers(res.data);
            setTotalPage(res.totalPage);
            setCurentPage(page)
        }
    }

    const handlePageClick = (event) => {
        fetchUserByPage(+event.selected + 1);
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
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
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
                                    <td>
                                        <button
                                            onClick={() => handleClickButtonView(item)}
                                            className="btn btn-secondary"
                                        >
                                            View
                                        </button>
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
            />
            <ModalDeleteUser
                dataDelete={dataUser}
                show={showModalDeleteUser}
                setShow={setShowModalDeleteUser}
                resetDataUser={resetDataUser}
                fetchUserByPage={fetchUserByPage}
            />
        </div>
    </>)
}

export default GetAllUser;