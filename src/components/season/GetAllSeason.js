const GetAllSeason = (props) => {
    return (
        <>
            <div className="getalluser-container">
                <div className="title">All User</div>
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
            </div>
        </>
    )
}

export default GetAllSeason;