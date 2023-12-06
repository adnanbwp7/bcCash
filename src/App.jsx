import { ToastContainer } from 'react-toastify'
import useFetchData from './helper'
import "react-toastify/dist/ReactToastify.css";

function App() {
  const {
    handleInputChange,
    handleButtonClick,
    qrCodeUrl,
    inputValue,
    btcValue, loading,
    walletAddress
  } = useFetchData()

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="min-h-screen p-4 flex flex-col gap-4 items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
        <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-1/2 lg:w-3/5">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Pay</h1>
          <div className="mb-6">
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500 transition duration-300"
              placeholder="Enter Vaue"
            />
            {btcValue &&
              <div className="w-full p-3 border my-5 rounded border-teal-500 transition duration-300">
                {btcValue}
              </div>
            }
          </div>

          <button
            disabled={(btcValue && !walletAddress) ? false : true || loading}
            onClick={handleButtonClick}
            className={`${(btcValue && !walletAddress) ? 'cursor-pointer' : 'cursor-not-allowed bg-teal-800 '} w-full bg-teal-500 text-white p-5 rounded hover:bg-teal-800 focus:outline-none transition duration-300`}
          >
            {loading ?
              <div className={`preloader-wrapper preloader-sm`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              :
              "Send"
            }
          </button>
        </div>
        {walletAddress &&
          <div className="bg-white flex-col rounded-lg shadow-lg w-full md:w-1/2 lg:w-3/5 flex p-4 flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-800">Wallet Address:</h1>
            <img src={qrCodeUrl} style={{ width: '15em' }} id="deposit" />
            <h1 className="text-base text-gray-800 break-all ">{walletAddress}</h1>
          </div>
        }

      </div>
      {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
      </div> */}

      {/* <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Open Modal
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black opacity-50 transition-all"
              onClick={closeModal}
            ></div>
            <div className="bg-white p-8 rounded-md z-10 transform transition-all scale-100 opacity-100">
              <h2 className="text-2xl font-semibold mb-4">Modern Modal</h2>
              <p className="text-gray-700 mb-4">
                Your modal content goes here.
              </p>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div> */}
    </>
  )
}

export default App
