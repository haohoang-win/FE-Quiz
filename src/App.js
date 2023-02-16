import './App.scss';
import Header from './components/header/header';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import { getUserAccount } from './services/userServices';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshPage, setWeekNumber } from './redux/slice/userSlice';
import { getCurrentSeason } from './services/seasonServices';

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
      let _id = res.DT._id
      let token = res.DT.access_token

      let data = {
        isAuthenticated: true,
        token,
        account: { role, email, username, _id },
      }
      dispatch(refreshPage(data))
    }
    let res1 = await getCurrentSeason();
    if (res1 && res1.EC === 0) {
      let dayOfStart = new Date(res1.DT[0].dayOfStart);
      let currentDate = new Date()
      let days = Math.floor((currentDate - dayOfStart) /
        (24 * 60 * 60 * 1000));
      let weekNumber = Math.ceil(days / 7)
      dispatch(setWeekNumber(weekNumber))
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
