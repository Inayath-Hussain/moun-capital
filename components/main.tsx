import { ChangeEvent, Dispatch, MouseEventHandler, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Contract, BrowserProvider } from "ethers";
import { toast } from 'react-toastify';
import ABI from '@/ABI.json';
import networkJSON from '@/network.json';
import network from "@/utilities/network";
import { selectList, Itodos, refreshList } from "@/redux/listSlice";
import { IEdit, IWeb3State } from "@/interfaces";

interface IpageProps {
    edit: IEdit,
    setEdit: Dispatch<SetStateAction<IEdit>>,
    initialEdit: IEdit
    walletInstalled: boolean,
    redirect: MouseEventHandler,
    web3State: IWeb3State,
    checkChain: () => Promise<unknown>,
    updateWeb3State: () => Promise<void>,
    contract_address: string,
    wait: boolean,
    setWait: Dispatch<SetStateAction<boolean>>,
    getListsRef: MutableRefObject<(() => Promise<void>) | null>
}

interface IinitialState {
    listName: string,
    title: {
        value: string,
        ref: ChangeEvent<HTMLInputElement> | null
    },
    description: {
        value: string,
        ref: ChangeEvent<HTMLTextAreaElement> | null
    }
}

// const contract_address = '0xdAF06E9F17C7aF4CD781DA3CdfC9338ffab440cD';

const Main = ({ edit, setEdit, initialEdit, walletInstalled, redirect,
    web3State, checkChain, updateWeb3State, contract_address, getListsRef }: IpageProps) => {

    const [newListName, setNewListName] = useState('');
    const [newTodo, setNewTodo] = useState<IinitialState[]>([])
    const dispatch = useDispatch()
    const tasks = useSelector(selectList)

    const getLists = async () => {
        const contract = new Contract(contract_address, ABI, web3State.provider)
        const list = await contract.getTodos(web3State.address)
        if (list.length > 0) {

            const tasks1 = []
            for (let li of list) {
                // listName
                const listName = li[0]
                const todos = []
                if (li[1].length > 0) {
                    for (let each of li[1]) {
                        const id = each[0]
                        const title = each[1]
                        const description = each[2]
                        const isDone = each[3]
                        todos.push({ id, title, description, isDone })
                    }
                    tasks1.push({ listName, todos })
                } else {
                    tasks1.push({ listName, todos: [] })
                }
            }

            dispatch(refreshList(tasks1))
        }
    }
    getListsRef.current = getLists

    useEffect(() => {
        const { ethereum } = window;

        const connect = async () => {
            const provider = new BrowserProvider(ethereum)
            const currentChainId = Number((await provider.getNetwork()).chainId)
            if (currentChainId !== networkJSON.chainId) {
                await ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            ...network
                        }
                    ]
                }).then(async () => {
                    await updateWeb3State()
                });

            } else {
                await updateWeb3State()
            }
        }

        if (ethereum) {
            connect()
        }
    }, [])

    useEffect(() => {
        const { address } = web3State
        const call = async () => {
            await getLists();
        }

        if (address) {
            call()
        }
    }, [web3State.address])

    useEffect(() => {
        window.ethereum.on("chainChanged", updateWeb3State);
        window.ethereum.on("accountsChanged", updateWeb3State)

        return () => {
            window.ethereum.removeListener("chainChanged", updateWeb3State);
            window.ethereum.removeListener("accountsChanged", updateWeb3State);
        };
    }, []);

    const addNewList = async () => {
        const sameChain = await checkChain()
        if (sameChain) {
            try {
                const contract = new Contract(contract_address, ABI, web3State.signer)
                await contract.addList(newListName).then(async (res) => {
                    setNewListName('');
                    web3State.provider && toast.promise(web3State.provider?.waitForTransaction(res.hash), {
                        pending: 'Completing Transaction Please Wait..', success: 'Transaction Completed!!'
                    })

                    await web3State.provider?.waitForTransaction(res.hash).then(async (t) => {
                        await getLists()
                    })
                })
            } catch (ex) {
                console.log(ex)
            }
        }
    }

    const addNewTodo = async (listName: string) => {

        const data = newTodo.find(v => v.listName === listName)
        if (!data) {
            return toast('Title and Description is empty')
        }
        if (data.title.value === '' || data.description.value === '') {
            return toast(`${!data.title.value ? 'Title' : 'Description'} is empty`)
        }

        const sameChain = await checkChain()
        if (sameChain) {
            try {
                const contract = new Contract(contract_address, ABI, web3State.signer)
                const res = await contract.addTodo(listName, data.title.value, data.description.value)

                if (res) {
                    data.title.ref!.target.value = ''
                    data.description.ref!.target.value = ''

                    web3State.provider && toast.promise(web3State.provider?.waitForTransaction(res.hash), {
                        pending: 'Completing Transaction Please Wait..', success: 'Transaction Completed!!'
                    })

                    await web3State.provider?.waitForTransaction(res.hash).then(async (t) => {
                        const new_todo = newTodo.filter(v => v.listName !== listName)
                        setNewTodo([...new_todo])
                        await getLists()
                    })
                }
            } catch (ex) {
                console.log(ex)
            }
        }
    }


    const handleEdit = (listName: string, title: string, description: string, id: string) => {
        // same -> close
        if (edit.listName === listName && edit.prevTitle === title) {
            setEdit({ ...initialEdit })
            return
        }
        setEdit({ trigger: true, listName, title, description, prevTitle: title, id })
    }

    const handleChange = (type: 'title' | 'description', listName: string, value: string, ref: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const todo = newTodo.find(v => v.listName === listName)
        if (todo) {
            todo[type].value = value
            if (!todo[type].ref) {
                todo[type].ref = ref
            }
            const new_todo = [...newTodo]
            setNewTodo(new_todo)
            return
        }
        const data: IinitialState = {
            listName: listName,
            title: {
                value: '',
                ref: null
            },
            description: {
                value: '',
                ref: null
            }
        }
        data[type].value = value
        data[type].ref = ref
        const new_todo = [...newTodo]
        new_todo.push(data)
        setNewTodo(new_todo)
    }

    if (!walletInstalled) {
        return (
            <div className='p-4 col-start-2 col-end-4'>
                <div className="mt-10 w-full flex flex-col justify-center items-center m-3">
                    <h3 className="text-red-400">No Crypto Wallet Detected.</h3>
                    <div className="flex flex-row justify-start items-center">
                        <h3>Install <span className="text-white font-bold">MetaMask</span></h3>
                        <img src="/MetaMask_Fox.svg" alt="" className="h-12" />
                    </div>

                    <button onClick={redirect} className="mt-3 p-2 bg-primary text-white text-lg rounded-lg font-semibold">Click To Install</button>
                </div>
            </div>
        )
    }


    return (
        <div className={`h-[658px] overflow p-4 grid grid-flow-row auto-rows-lists gap-y-4 transition-all duration-[.5s] ${edit.trigger ? 'grid-cols-lists' : 'grid-cols-lists-edit-false col-start-2 col-end-4'}`}>
            {/* LIST */}
            {tasks.length > 0 && tasks.map(list => (
                <div className='w-72 m-2 flex flex-col' key={list.listName}>
                    <div className='w-full h-12 text-white text-base font-semibold pl-3 flex justify-start items-center bg-light-card rounded-xl my-[2px]'>
                        List : {list.listName}
                    </div>

                    {/*ADD LIST ITEM */}
                    <div className='mt-2 h-28 w-full rounded-2xl p-3 flex flex-col bg-card'>
                        {/* Top */}
                        <div className='flex flex-row justify-between items-center mb-1'>
                            {/*ADD title, logo and add */}
                            <div className='flex flex-row justify-start items-center '>
                                <img src="/item.svg" alt="" />
                                <input onChange={(e) => handleChange("title", list.listName, e.target.value, e)} placeholder='Add Todo' className='bg-card w-[80%] text-white outline-0 ml-2 font-bold text-lg' />
                            </div>

                            <img id="" onClick={() => addNewTodo(list.listName)} title="add to list" src="/add.svg" alt="" className='w-[30] h-[30] rounded-half bg-section p-2 cursor-pointer' />
                        </div>
                        {/*ADD Description */}
                        <textarea onChange={(e) => handleChange("description", list.listName, e.target.value, e)} draggable={false} placeholder='Add Todo Description' className='resize rounded-2xl p-1 outline-0 text-white bg-card w-full text-base font-medium' />
                    </div>

                    {list?.todos?.length > 0 && list.todos.map((todo: Itodos) => (
                        <div className='mt-2 min-h-[112px] w-full rounded-2xl p-3 flex flex-col bg-card' key={`${todo.title}${todo.description}`}>
                            {/* Top */}
                            <div className='flex flex-row justify-between items-center mb-2'>
                                {/* logo, title and add */}
                                <div className='flex flex-row justify-start items-center '>
                                    <img src="/item.svg" alt="" />
                                    <div className='ml-2 text-white font-bold text-lg'>{todo.title}</div>
                                </div>

                                <img onClick={() => handleEdit(list.listName, todo.title, todo.description, todo.id)} src="/edit.svg" alt="" className='cursor-pointer fill-white' />
                            </div>
                            {/* Description */}
                            <div className=' w-full text-base font-medium'>{todo.description}</div>
                        </div>
                    ))}
                </div>
            ))}

            {/*ADD LIST */}
            <div className='w-72 m-2 flex flex-col'>
                {/*ADD LIST TITLE */}
                <div className='flex flex-row justify-between items-center w-full bg-light-card rounded-xl pr-1'>
                    <input onChange={(e) => setNewListName(e.target.value)} value={newListName} className='outline-0 w-[80%] h-12 text-white text-base font-semibold pl-3 flex justify-start items-center bg-light-card rounded-xl my-[2px]'
                        placeholder='Add Todo-List' />

                    <img onClick={addNewList} title="Create New List" src="/add.svg" alt="" className='w-[30] h-[30] rounded-half bg-section p-2 cursor-pointer' />
                </div>
            </div>


        </div>
    );
}

export default Main;