import './App.scss';
import Header from './components/header/header';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import { getUserAccount } from './services/userServices';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshPage } from './redux/slice/userSlice';

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    let res = await getUserAccount();
    if (res && res.EC === 0) {
      let role = res.DT.role
      let email = res.DT.email
      let username = res.DT.username
      let token = res.DT.access_token

      let data = {
        isAuthenticated: true,
        token,
        account: { role, email, username },
      }
      dispatch(refreshPage(data))
    }
  }

  return (
    <>
      <div className='app-container'>
        <Header />
        <Container>
          <AppRoutes />
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
