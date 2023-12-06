import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
const API_URL = 'http://localhost:3000/api'

let timeOutId = undefined
let transactionId = undefined

const useFetchData = () => {
    const [inputValue, setInputValue] = useState();
    const [ethValue, setethValue] = useState()
    const [walletAddress, setWalletAddress] = useState()
    const [loading, setLoading] = useState(false)
    const [qrCodeUrl, setQrCodeUrl] = useState("https://cdn.mainnet.cash/wait.svg")
    const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0 });
    const [fetchingPrice, setFetchingPrice] = useState(false)
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const fetch_price = async () => {
        setFetchingPrice(true)
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=eth");
        if (response.status == 200) {
            setFetchingPrice(false)
            const data = response.data;
            const ethPrice = data.usd.eth;
            const priceInBTC = ethPrice * inputValue;
            setethValue(priceInBTC)
        } else {
            setFetchingPrice(false)
            toast.error('Error while fetcing Price!');
        }
    }

    const create_wallet = async () => {
        setLoading(true)
        const response = await axios.get(`${API_URL}/create_wallet`)
        if (response.data.status == 200) {
            setLoading(false)
            const address = response.data.data.wallet_address
            setWalletAddress(address)
            startCountdown()
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(address)}&size=200x200`)
        } else {
            setLoading(false)
            toast.error('Error while fetcing Price!');
        }
    }

    const transaction_Approval = async (address) => {
        const response = await axios.get(`${API_URL}/performTransaction?wallet_address=${address}&&amount=${ethValue}`,)
        if (response.data.status == 200) {
            toast.success("Transaction Successfull");
            setInputValue('')
            setethValue('')
            setWalletAddress()
            startCountdown({ minutes: 0, seconds: 0 })
            // setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(address)}&size=200x200`)
        }
    }

    const handleButtonClick = () => {
        if (ethValue) {
            create_wallet()
        }
        // console.log('Input Value:', inputValue);
    };

    useEffect(() => {
        if (inputValue) {
            if (timeOutId) {
                clearTimeout(timeOutId)
            }
            timeOutId = setTimeout(() => {
                fetch_price()
            }, 1000);
        }
        if (!inputValue) {
            setethValue()
            setWalletAddress()
            setQrCodeUrl('https://cdn.mainnet.cash/wait.svg')
        }
    }, [inputValue])

    useEffect(() => {
        if (walletAddress) {
            // Set up interval to call create_wallet every 10 minutes
            const intervalId = setInterval(() => {
                transaction_Approval(walletAddress)
            }, 10 * 1000);
            // Cleanup interval on component unmount
            return () => clearInterval(intervalId);
        }
    }, [walletAddress]); // Empty dependency array ensures this effect runs only once on mount


    const startCountdown = () => {
        setTimeRemaining({ minutes: 10, seconds: 0 }); // Reset the countdown

        const intervalId = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime.minutes === 0 && prevTime.seconds === 0) {
                    clearInterval(intervalId);

                    setWalletAddress(); // Reset wallet address after countdown
                    toast.error('Wallet has been expired. Please Try Again!', {
                        toastId: 'expire'
                    });
                } else {
                    const newSeconds = prevTime.seconds - 1;
                    const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
                    return {
                        minutes: newMinutes,
                        seconds: newSeconds >= 0 ? newSeconds : 59,
                    };
                }
            });
        }, 1000);
    };

    return {
        handleInputChange,
        handleButtonClick,
        loading, qrCodeUrl,
        walletAddress,
        fetchingPrice,
        inputValue, ethValue,
        timeRemaining
    }
}

export default useFetchData