"use client";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from "../common/abi";
import {
  BaseError,
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { baseSepolia, optimismSepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  baseChannelName,
  baseDispatcherContract,
  baseProvider,
  baseUCAddress,
  factoryAddress,
  opChannelName,
  opDispatcherContract,
  opProvider,
  opUCAddress,
} from "../common/config";
import { generateRandomString, getExplorerUrl } from "../common/utils";

export default function Deployer() {
  const [tokenName, setTokenName] = useState("MyToken");
  const [tokenSymbol, setTokenSymbol] = useState("MTK");
  const [totalSupply, setTotalSupply] = useState("1000000");
  const [currentMintStatus, setCurrentMintStatus] = useState("");
  const [counterpartyMintStatus, setCounterpartyMintStatus] = useState("");
  const [ackMintStatus, setAckMintStatus] = useState("");
  const [sequence, setSequence] = useState<bigint | null>(null);
  const [counterpartyTxHash, setCounterpartyTxHash] = useState<`0x${string}` | null>(null);
  const [ackTxHash, setAckTxHash] = useState<`0x${string}` | null>(null);

  const account = useAccount();
  const chainId = useChainId();
  const { isConnected: isWalletConnected } = useAccount();
  const {
    data: hash,
    isPending,
    writeContract,
    error,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    const trackMintStatus = async () => {
      if (isConfirmed && hash) {
        const currentChain = chainId === baseSepolia.id ? baseSepolia : optimismSepolia;
        const counterpartyChain =
          chainId === baseSepolia.id ? optimismSepolia : baseSepolia;

        const currentProvider = chainId === baseSepolia.id ? baseProvider : opProvider;
        const counterpartyProvider =
          chainId === baseSepolia.id ? opProvider : baseProvider;
        const currentDispatcherContract =
          chainId === baseSepolia.id ? baseDispatcherContract : opDispatcherContract;
        const counterpartyDispatcherContract =
          chainId === baseSepolia.id ? opDispatcherContract : baseDispatcherContract;
        const currentUCAddress = chainId === baseSepolia.id ? baseUCAddress : opUCAddress;
        const counterpartyUCAddress =
          chainId === baseSepolia.id ? opUCAddress : baseUCAddress;
        const currentChannelName =
          chainId === baseSepolia.id ? baseChannelName : opChannelName;
        const counterpartyChannelName =
          chainId === baseSepolia.id ? opChannelName : baseChannelName;

        setCurrentMintStatus(`Token minted on ${currentChain.name}`);

        const receipt = await currentProvider.getTransactionReceipt(hash);
        for (let log of receipt?.logs || []) {
          let decoded = currentDispatcherContract.interface.parseLog(log);
          if (decoded && decoded.name === "SendPacket") {
            const [, , , sequence] = decoded.args;
            setSequence(sequence);
            setCounterpartyMintStatus(
              `Minting in progress on ${counterpartyChain.name}`
            );
          }
        }

        const checkCounterpartyMint = async () => {
          const counterpartyBlockNumber = await counterpartyProvider.getBlockNumber();
          const recvLogFilter = counterpartyDispatcherContract.filters.RecvPacket!(
            counterpartyUCAddress,
            counterpartyChannelName
          );
          const logs = await counterpartyDispatcherContract.queryFilter(
            recvLogFilter,
            counterpartyBlockNumber - 1000
          );

          for (let log of logs) {
            let decoded = counterpartyDispatcherContract.interface.parseLog(log);
            if (decoded && decoded.name === "RecvPacket") {
              const [, , recvSeq] = decoded.args;
              if (recvSeq == sequence) {
                setCounterpartyTxHash(log.transactionHash as `0x${string}`);
                setCounterpartyMintStatus(
                  `Token minted on ${counterpartyChain.name}`
                );
                if (!ackTxHash) {
                  setAckMintStatus(
                    `Acknowledgement in progress on ${currentChain.name}`
                  );
                }
                return;
              }
            }
          }

          setTimeout(checkCounterpartyMint, 1000);
        };

        const checkAck = async () => {
          const currentBlockNumber = await currentProvider.getBlockNumber();
          const ackLogFilter = currentDispatcherContract.filters.Acknowledgement!(
            currentUCAddress,
            currentChannelName
          );
          const ackLogs = await currentDispatcherContract.queryFilter(
            ackLogFilter,
            currentBlockNumber - 1000
          );

          for (let log of ackLogs) {
            let decoded = currentDispatcherContract.interface.parseLog(log);
            if (decoded && decoded.name === "Acknowledgement") {
              const [, , ackSeq] = decoded.args;
              if (ackSeq == sequence) {
                setAckTxHash(log.transactionHash as `0x${string}`);
                setAckMintStatus(`Token mint acknowledged on ${currentChain.name}`);
                return;
              }
            }
          }

          setTimeout(checkAck, 1000);
        };

        checkCounterpartyMint();
        checkAck();
      }
    };

    trackMintStatus();
  }, [isConfirmed, hash, chainId, sequence]);

  const handleDeploy = async () => {
    const salt = generateRandomString(32);
    let channels = [];
    if (chainId === baseSepolia.id) {
      channels = ["channel-11"];
    } else {
      channels = ["channel-10"];
    }

    writeContract({
      address: factoryAddress,
      abi,
      functionName: "deployXPolyERC20",
      args: [
        channels,
        tokenName,
        tokenSymbol,
        ethers.parseUnits(totalSupply, 18),
        salt,
      ],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex justify-center">
              <ConnectButton />
            </div>
            {isWalletConnected ? (
              <>
                {isConfirming || isConfirmed ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {isConfirming &&
                          "Transaction sent, waiting for confirmation..."}
                        {isConfirmed && (
                          <>
                            {currentMintStatus && (
                              <div className="py-2">
                                <p>{currentMintStatus}</p>
                                {hash && (
                                  <a
                                    href={`${getExplorerUrl(chainId, hash)}`}
                                    target="_blank"
                                    className={"text-blue-500"}
                                  >
                                    View Transaction
                                  </a>
                                )}
                              </div>
                            )}
                            {counterpartyMintStatus && (
                              <div className="py-2">
                                <p>{counterpartyMintStatus}</p>
                                {counterpartyTxHash && (
                                  <a
                                    href={`${getExplorerUrl(
                                      chainId === baseSepolia.id
                                        ? optimismSepolia.id
                                        : baseSepolia.id,
                                      counterpartyTxHash
                                    )}`}
                                    target="_blank"
                                    className={"text-blue-500"}
                                  >
                                    View Counterparty Transaction
                                  </a>
                                )}
                              </div>
                            )}
                            {ackMintStatus && (
                              <div className="py-2">
                                <p>{ackMintStatus}</p>
                                {ackTxHash && (
                                  <a
                                    href={`${getExplorerUrl(chainId, ackTxHash)}`}
                                    target="_blank"
                                    className={"text-blue-500"}
                                  >
                                    View Acknowledgement Transaction
                                  </a>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-4xl text-center">
                      Deploy Your PolyERC20 Token
                    </h1>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="token-name">Token Name</Label>
                        <Input
                          id="token-name"
                          onChange={(e) => setTokenName(e.target.value)}
                          placeholder="MyToken"
                          required
                          value={tokenName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="token-symbol">Token Symbol</Label>
                        <Input
                          id="token-symbol"
                          onChange={(e) => setTokenSymbol(e.target.value)}
                          placeholder="MTK"
                          required
                          value={tokenSymbol}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supply">Total Supply</Label>
                        <Input
                          id="supply"
                          onChange={(e) => setTotalSupply(e.target.value)}
                          placeholder="1000000"
                          required
                          value={totalSupply}
                        />
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-yellow-400 to-red-500"
                        onClick={handleDeploy}
                        disabled={isPending || isConfirming || isConfirmed}
                      >
                        {isPending ? "Deploying..." : "Deploy Token"}
                      </Button>
                      {error && (
                        <div>
                          {(error as BaseError).shortMessage || error.message}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center">
                Please connect your wallet to deploy a token.
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center justify-center">
            <img
              alt="Deploy Token Image"
              className="object-cover rounded-lg shadow-2xl"
              height={500}
              src="/oip61teo.png"
              style={{ aspectRatio: "500/500", objectFit: "cover" }}
              width={500}
            />
          </div>
        </div>
      </section>
    </div>
  );
}