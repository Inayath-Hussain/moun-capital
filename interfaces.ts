import { BrowserProvider, JsonRpcSigner } from "ethers";

export interface IWeb3State {
    address: string | null;
    currentChain: number | null;
    signer: JsonRpcSigner | null;
    provider: BrowserProvider | null;
    balance: number | null
}

export interface IEdit {
    trigger: boolean
    listName: string;
    title: string,
    description: string,
    prevTitle: string,
    id: string
}

export interface Idata {
    address: string | null;
    signer: JsonRpcSigner | null;
    balance: number | null
}