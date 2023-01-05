import './App.scss';
import Header from './components/header/header';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <div className='app-container'>
        <Header />
        <Container>
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
