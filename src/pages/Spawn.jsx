import React, { createContext, useContext,useState, useEffect } from "react";
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { useToast } from "../context/toast_context";
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

function Spawn() {
  const { transactionInfo, error, handleWalletConnect, handleNetworkChange } = useContext(TransactionContext);

  const [input, setInput] = useState({
    member_account: "",
    owner_account: "",
  });

  const [applicantName, setApplicantName] = useState('');
  const [applicantAddress, setApplicantAddress] = useState('');

  const [showEnable, setShowEnable] = useState(false);
  const [spawnDetail, setSpawnDetail] = useState("");

  const { showToast } = useToast();

  const handleChange = (e, name) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const createCreditContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(
      creditAddress,
      creditABI,
      signer
    );

    return transactionsContract;
  };

  const createNftContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(
      nftAddress,
      nftABI,
      signer
    );

    return transactionsContract;
  };

  useEffect(async () => {

    getApplicantName();

    getApplicantAddress();

  },[]);

  async function getApplicantName() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();

        const applicant_name =
          await nftContract.getCurApplicantName(1);

        console.log("check applicant Name:"+applicant_name);
        setApplicantName(applicant_name);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getApplicantAddress() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();

        const applicant_address =
          await nftContract.getCurApplicantAddress(1);

        console.log("check applicant address:"+applicant_address);
        setApplicantAddress(applicant_address);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function SpawnMember() {
    if (!input) return

    // console.log(input.member_account);
    // console.log(input.owner_account);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();
        const seccode = await nftContract.spawnMulti(applicantAddress);

        console.log("spawnMulti:"+applicant_address);

        nftContract.on('SpawnAgree', function(event, agreenum){
          console.log(agreenum); 
          setSpawnDetail(String(agreenum));
          setShowEnable(true);
        })
      }
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  }

  return (
    <div className="flex w-full justify-center items-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
      <h1 className="font-semibold text-lg text-yellow-200">Approve New Member</h1>
      <h1 className="font-semibold text-lg text-yellow-200">新会员入会投票</h1>
        <label
          htmlFor="member_name"
          className="flex flex-col items-start justify-center"
        >
          <p>Applying Member Name（申请会员名字）</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled" 
          value = {applicantName}
          id="applicant_name"
          name="applicant_name"
          className="my-2 w-half justify-leftborder border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="member_address"
          className="flex flex-col items-start justify-center"
        >
          <p>Address（地址）</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled" 
          value = {applicantAddress}
          id="applicant_address"
          name="applicant_address"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <button onClick={SpawnMember} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Spawn
        </button>
        <div>
          {
            showEnable?(<p className="font-semibold text-lg text-green-600">Agree Number is {spawnDetail}</p>) : ''
          }
        </div>
      </div>
    </div>
  )
}

export default Spawn
