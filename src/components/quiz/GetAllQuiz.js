import { useEffect, useState } from "react";
import { getQuizByPage } from "../../services/quizServices";
import ReactPaginate from "react-paginate";
import ModalViewQuiz from "./Modal/ModalViewQuiz";
import ModalEditQuiz from "./Modal/ModalEditQuiz";
import ModalDeleteQuiz from "./Modal/ModalDeleteQuiz";

const GetAllQuiz = (props) => {
    const limit = 6;
    const [currentPage, setCurentPage] = useState(1)
    const [totalPage, setTotalPage] = useState()
    const [listQuizzes, setListQuizzes] = useState();
    const [dataQuiz, setDataQuiz] = useState({})

    const [showModalViewQuiz, setShowModalViewQuiz] = useState(false)
    const [showModalEditQuiz, setShowModalEditQuiz] = useState(false)
    const [showModalDeleteQuiz, setShowModalDeleteQuiz] = useState(false)

    useEffect(async () => {
        await fetchQuizByPage(1);
    }, [])

    const fetchQuizByPage = async (page) => {
        let res = await getQuizByPage(page, limit);
        if (res && res.EC === 0) {
            setListQuizzes(res.DT)
            setTotalPage(res.totalPage)
            setCurentPage(page)
        }
    }

    const handlePageClick = (event) => {
        fetchQuizByPage(+event.selected + 1);
    }

    const handleClickButtonView = (quiz) => {
        setShowModalViewQuiz(true)
        setDataQuiz(quiz)
    }

    const handleClickButtonUpdate = (quiz) => {
        setShowModalEditQuiz(true)
        setDataQuiz(quiz)
    }

    const handleClickButtonDelete = (quiz) => {
        setShowModalDeleteQuiz(true)
        setDataQuiz(quiz)
    }

    const resetDataQuiz = () => {
        setDataQuiz({})
    }

    return (
        <>
            <div className="getallquiz-container">
                <div className="title">All Quiz</div>
                <table className="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listQuizzes && listQuizzes.length > 0 &&
                            listQuizzes.map((item, index) => {
                                return (
                                    <tr key={`table-quizzes-${index}`}>
                                        <td>{(limit * (currentPage - 1)) + (index + 1)}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
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
                            listQuizzes && listQuizzes.length === 0 &&
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
                <ModalViewQuiz
                    dataQuiz={dataQuiz}
                    show={showModalViewQuiz}
                    setShow={setShowModalViewQuiz}
                    resetDataQuiz={resetDataQuiz}
                />
                <ModalEditQuiz
                    dataQuiz={dataQuiz}
                    show={showModalEditQuiz}
                    setShow={setShowModalEditQuiz}
                    resetDataQuiz={resetDataQuiz}
                    fetchQuizByPage={fetchQuizByPage}
                    currentPage={currentPage}
                />
                <ModalDeleteQuiz
                    dataDelete={dataQuiz}
                    show={showModalDeleteQuiz}
                    setShow={setShowModalDeleteQuiz}
                    resetDataQuiz={resetDataQuiz}
                    fetchQuizByPage={fetchQuizByPage}
                />
            </div>
        </>
    )
}

export default GetAllQuiz;