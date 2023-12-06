import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
const API_URL = 'http://localhost:3000/api'
let timeOutId = undefined


const useFetchData = () => {
    const [inputValue, setInputValue] = useState();
    const [btcValue, setBtcValue] = useState()
    const [walletAddress, setWalletAddress] = useState()
    const [loading, setLoading] = useState(false)
    const [qrCodeUrl, setQrCodeUrl] = useState("https://cdn.mainnet.cash/wait.svg")
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const fetch_price = async () => {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=bch");
        if (response.status == 200) {
            const data = response.data;
            const ethPrice = data.usd.bch;
            const priceInBTC = ethPrice * inputValue;
            setBtcValue(priceInBTC)
        } else {
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
            transaction_Approval(address)
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(address)}&size=200x200`)
        } else {
            setLoading(false)
            toast.error('Error while fetcing Price!');
        }
    }
    const transaction_Approval = async (address) => {
        const body = {
            amount: btcValue,
            user_wallet_address: address
        }
        const response = await axios.post(`${API_URL}/performTransaction`, body)
        console.log("🚀 ~ file: helper.jsx:51 ~ consttransaction_Approval= ~ response:", response)
        if (response.data.status == 200) {
            toast.success("Transaction Successfull",{toastId: "success"});
            setInputValue('')
            setBtcValue('')
            setWalletAddress()
        } else {
            setLoading(false)
            toast.error('Error while fetcing Price!', { toastId: "fail" });
        }
    }

    const handleButtonClick = () => {
        if (btcValue) {
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
                setBtcValue()
                setWalletAddress()
                setQrCodeUrl('https://cdn.mainnet.cash/wait.svg')
                fetch_price()
            }, 1000);
        }
        if (!inputValue) {
            setBtcValue()
            setWalletAddress()
            setQrCodeUrl('https://cdn.mainnet.cash/wait.svg')
        }
    }, [inputValue])


    return {
        handleInputChange,
        handleButtonClick,
        loading, qrCodeUrl,
        walletAddress,
        inputValue, btcValue
    }
}

export default useFetchData