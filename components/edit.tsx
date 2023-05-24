import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import { Contract } from "ethers";
import { toast } from 'react-toastify';
import ABI from '@/ABI.json';
import { IWeb3State, IEdit } from "@/interfaces";

interface IpageProps {
    edit: IEdit,
    setEdit: Dispatch<SetStateAction<IEdit>>,
    checkChain: () => Promise<unknown>,
    web3State: IWeb3State,
    contract_address: string,
    getListsRef: MutableRefObject<(() => Promise<void>) | null>,
    initialEdit: IEdit,
    updateWeb3State: () => Promise<void>,
}

const EditBar = ({ edit, setEdit, checkChain, contract_address, web3State, getListsRef, initialEdit, updateWeb3State }: IpageProps) => {

    const [wait, setWait] = useState(false)

    const save = async () => {
        const sameChain = await checkChain();
        if (sameChain) {
            const contract = new Contract(contract_address, ABI, web3State.signer)
            const res = await contract.updateTodo(edit.id, edit.listName, edit.title, edit.description)
            if (res) {
                // clean up
                web3State.provider && toast.promise(web3State.provider?.waitForTransaction(res.hash), {
                    pending: 'Completing Transaction Please Wait..', success: 'Transaction Completed!!'
                })
                setWait(true)
                web3State.provider?.waitForTransaction(res.hash).then(async () => {
                    if (getListsRef.current) {
                        setWait(false)
                        setEdit(initialEdit)
                        await getListsRef.current().then(async () => await updateWeb3State())
                    }
                })

            }
        }
    }

    return (
        <div className={`pl-4 pt-6  transition-all duration-[.5s] ${edit.trigger ? 'slide-in' : ' hidden'}`}>
            <div className="flex flex-row items-center justify-start">
                <img src="/back.svg" alt="" onClick={() => setEdit(initialEdit)} className="cursor-pointer" />
                <div className="font-medium ml-4 text-lg text-white">Edit Todo</div>

            </div>
            <input onChange={(e) => setEdit({ ...edit, title: e.target.value })} value={edit.title} type="text" placeholder="title" className="mt-2 mb-4 text-xl font-bold bg-border text-white outline-0 py-2 px-3 rounded-xl" />

            <textarea onChange={(e) => setEdit({ ...edit, description: e.target.value })} value={edit.description} draggable={false} placeholder="Description" className="resize mb-7 py-3 px-4 h-36 w-72 font-semibold text-sm rounded-xl bg-border text-white outline-0"></textarea>

            <div className="flex justify-center items-center">
                <button disabled={wait} onClick={save} className={`${wait ? 'cursor-wait' : 'cursor-pointer'} w-24 h-8 rounded-lg gap-2 bg-primary text-sm font-semibold text-white`}>Save</button>
            </div>
        </div>
    );
}

export default EditBar;