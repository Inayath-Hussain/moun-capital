import { useEffect, useRef, useState } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import MetaMaskOnBoarding from '@metamask/onboarding';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditBar from '@/components/edit';
import SideBar from '@/components/sidebar';
import Main from '@/components/main';
import network from '@/utilities/network'
import networkJSON from '@/network.json'
import { IWeb3State, IEdit, Idata } from '@/interfaces';


const initialEdit: IEdit = {
  trigger: false,
  listName: '',
  title: '',
  description: '',
  prevTitle: '',
  id: ''
}

const initialWeb3State: IWeb3State = {
  address: null,
  currentChain: null,
  signer: null,
  provider: null,
  balance: null
};

const contract_address = '0xdAF06E9F17C7aF4CD781DA3CdfC9338ffab440cD';

export default function Home() {
  const [web3State, setWeb3State] = useState<IWeb3State>(initialWeb3State);
  const [edit, setEdit] = useState<IEdit>(initialEdit)
  const [walletInstalled, setWalletInstalled] = useState(false)
  const onboarding = useRef<MetaMaskOnBoarding>();
  const origin = useRef<string>();
  const [wait, setWait] = useState(false);
  const getListsRef = useRef<(() => Promise<void>) | null>(null)

  const grabNetwork = async (provider: BrowserProvider) => {
    return Number((await provider.getNetwork()).chainId)
  }

  const updateWeb3State = async () => {
    const { ethereum } = window
    const provider = new BrowserProvider(ethereum)
    const currentChain = await grabNetwork(provider)
    const accounts: JsonRpcSigner[] = await provider.listAccounts()
    const data: Idata = { address: null, signer: null, balance: null }

    if (accounts.length > 0) {
      const address = accounts[0].address
      const balance = Number(await provider.getBalance(address)) / 10 ** 18
      const signer = await provider.getSigner(address)
      data.address = address
      data.signer = signer
      data.balance = balance
    }

    setWeb3State({
      address: data.address,
      currentChain,
      provider,
      signer: data.signer,
      balance: data.balance
    })

  }

  const checkChain = async () => {
    return new Promise(resolve => {
      if (web3State.currentChain !== networkJSON.chainId) {
        const { ethereum } = window;
        ethereum.request({ method: "wallet_addEthereumChain", params: [{ ...network }] }).then(async () => {
          updateWeb3State().then(async () => { resolve(true) })
        })
      }
      else {
        resolve(true)
      }
    })
  }

  useEffect(() => {
    const { ethereum } = window
    if (ethereum) {
      setWalletInstalled(true)
    }
  }, [])

  const redirect = () => {
    if (!onboarding.current) {
      onboarding.current = onboarding.current = new MetaMaskOnBoarding({ forwarderOrigin: origin.current });
    }
    onboarding.current?.startOnboarding()
  }

  return (
    <>
      <ToastContainer theme='dark' position='top-left' />
      <div className='min-h-screen grid grid-cols-main grid-rows-main bg-black'>

        <div className='font-semibold row-start-1 row-end-2 col-span-full bg-primary flex justify-center min-w-full text-white text-sm py-2'>Lorem Ipsum is simply dummy text of the printing</div>

        <SideBar />

        {/* top */}
        <div className='flex flex-row justify-between border-b-4 border-solid border-border border-x-0 border-t-0 col-start-2 col-end-4 row-start-2 row-end-3'>
          <div className=' text-lg underline underline-blue underline-offset-4 ml-10 mt-4 text-white'>Section</div>

          <div className='rounded-xl mr-4 mt-2 bg-card flex flex-row justify-around items-center w-48 h-9'>
            <img src="/wallet.svg" alt="" />
            <div className='font-medium text-base text-white'>{web3State.balance ? web3State.balance.toString().slice(0, 5) : ''} TBNB</div>
            <div className='font-semibold rounded-md text-xs w-12 h-5 flex justify-center items-center text-primary bg-secondary'>Tier 1</div>
          </div>

        </div>

        {/* main (TODO LISTS CONTAINER) */}
        <Main getListsRef={getListsRef} contract_address={contract_address} checkChain={checkChain} web3State={web3State} updateWeb3State={updateWeb3State}
          edit={edit} initialEdit={initialEdit} redirect={redirect} walletInstalled={walletInstalled} setEdit={setEdit} />

        <EditBar updateWeb3State={updateWeb3State} getListsRef={getListsRef} initialEdit={initialEdit} contract_address={contract_address} checkChain={checkChain} web3State={web3State} edit={edit} setEdit={setEdit} />

      </div>
    </>
  )
}
