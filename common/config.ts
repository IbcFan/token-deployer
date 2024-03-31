import { ethers, JsonRpcProvider } from "ethers";
import { baseSepolia, optimismSepolia } from "wagmi/chains";
import { dispatcherAbi } from "./abi";

export const factoryAddress = "0xF24a7a113c85A1886a7B0bb518b8d49b9B5BC062";
const opDispatcherAddress = "0x6C9427E8d770Ad9e5a493D201280Cc178125CEc0";
const baseDispatcherAddress = "0x0dE926fE2001B2c96e9cA6b79089CEB276325E9F";
export const opProvider = new JsonRpcProvider(optimismSepolia.rpcUrls.default.http[0], optimismSepolia.id);
export const baseProvider = new JsonRpcProvider(baseSepolia.rpcUrls.default.http[0], baseSepolia.id);
export let opUCAddress = process.env.OP_UC_MW_SIM || "0xC3318ce027C560B559b09b1aA9cA4FEBDDF252F5";
export let baseUCAddress = process.env.BASE_UC_MW_SIM || "0x5031fb609569b67608Ffb9e224754bb317f174cD";
export let baseChannelName = ethers.encodeBytes32String(process.env.BASE_CHANNEL || "channel-11");
export let opChannelName = ethers.encodeBytes32String(process.env.OP_CHANNEL || "channel-10");
export const opDispatcherContract = new ethers.Contract(opDispatcherAddress, dispatcherAbi, opProvider);
export const baseDispatcherContract = new ethers.Contract(baseDispatcherAddress, dispatcherAbi, baseProvider);