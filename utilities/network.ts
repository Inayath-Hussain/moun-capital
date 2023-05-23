import networkJSON from '@/network.json';

interface INetwork {
    chainId: string,
    chainName: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    rpcUrls: string[],
    blockExplorerUrls: string[]
}

const network: INetwork = {
    chainId: `0x${Number(networkJSON.chainId).toString(16)}`,
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
        name: "Binance Chain Native Token",
        symbol: "tBNB",
        decimals: 18
    },
    rpcUrls: [
        "https://data-seed-prebsc-1-s1.binance.org:8545",
        "https://data-seed-prebsc-2-s1.binance.org:8545",
        "https://data-seed-prebsc-1-s2.binance.org:8545",
        "https://data-seed-prebsc-2-s2.binance.org:8545",
        "https://data-seed-prebsc-1-s3.binance.org:8545",
        "https://data-seed-prebsc-2-s3.binance.org:8545",
        "https://bsc-testnet.publicnode.com"
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com"]
}

export default network;