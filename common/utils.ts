import { baseSepolia } from "wagmi/chains";

export function generateRandomString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getExplorerUrl(chainId: number, hash?: `0x${string}`) {
  if (chainId === baseSepolia.id) {
    return `https://base-sepolia.blockscout.com/tx/${hash}`;
  }
  return `https://optimism-sepolia.blockscout.com/tx/${hash}`;
}