import { ToastContainer } from 'react-toastify'
import useFetchData from './helper'
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';

const App = () => {
  const {
    handleInputChange,
    handleButtonClick,
    qrCodeUrl,
    inputValue,
    fetchingPrice,
    ethValue, loading,
    walletAddress, timeRemaining
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
            {fetchingPrice ?
              <div className="w-full p-3 h-12 border my-5 rounded border-gray-200 bg-gray-200 transition duration-300 animate-pulse">
              </div>
              :
              ethValue && <div className="w-full p-3 border my-5 rounded border-teal-500 transition duration-300">
                {ethValue}
              </div>
            }
          </div>

          <button
            disabled={(ethValue && !walletAddress) ? false : true || loading}
            onClick={handleButtonClick}
            className={`${(ethValue && !walletAddress) ? 'cursor-pointer' : 'cursor-not-allowed bg-teal-800 '} w-full bg-teal-500 text-white p-5 rounded hover:bg-teal-800 focus:outline-none transition duration-300`}
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
            <h1 className="text-base text-red-500 break-all font-semibold">
              Wallet Address will be expire in: {String(timeRemaining?.minutes).padStart(2, '0')}:{String(timeRemaining?.seconds).padStart(2, '0')}
            </h1>
          </div>
        }
      </div>
    </>
  )
}

export default App