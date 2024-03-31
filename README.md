# PolyERF20 Cross-Chain Token Deployer

**Token Deployer** is a Next.js application that allows users to deploy ERC20 tokens on multiple chains using the Interblockchain Communication (IBC) protocol. The application leverages the Universal Channel feature of Polymer's IBC to enable seamless token deployment across different blockchain networks.

## Run-book

To run the Token Deployer application locally, follow these steps:

1. Clone the repository: `git clone https://github.com/IbcFan/token-deployer.git`
2. Navigate to the project directory: `cd token-deployer`
3. Install dependencies: `npm install`
4. Set up environment variables:
    - `OPTIMISM_RPC`: Provide the RPC URL for the Optimism Sepolia testnet
    - `BASE_RPC`: Provide the RPC URL for the Base Sepolia testnet
    - `OP_UC_MW_SIM`: Provide the address of the Optimism Universal Channel middleware (optional)
    - `BASE_UC_MW_SIM`: Provide the address of the Base Universal Channel middleware (optional)
    - `OP_CHANNEL`: Provide the channel name for the Optimism network (optional)
    - `BASE_CHANNEL`: Provide the channel name for the Base network (optional)
5. Start the development server: `npm run dev`
6. Open your browser and navigate to `http://localhost:3000`

## Resources Used
- [PolyERC20](https://github.com/IbcFan/PolyERC20)
- Next.js
- Tailwind CSS
- Ethers.js
- Wagmi
- Rainbow Kit
- Radix UI

## Demo videos
- [Token Deployer](https://www.youtube.com/watch?v=Iy2ispPWvxk)
- [Token Deployer in Farcaster](https://www.youtube.com/watch?v=EbYfHjjS8I0)

## Challenges Faced

1. **Understanding IBC Protocol**: Grasping the concepts and implementation details of the Interblockchain Communication (IBC) protocol was a significant challenge. I had to study the protocol documentation and existing implementations to understand how to leverage it for token deployment across multiple chains.

2. **Integrating with Universal Channel**: Implementing the Universal Channel feature of IBC required a deep understanding of the protocol and its various components. I had to ensure that the token deployment process was seamless and worked correctly across different blockchain networks.

## Future Improvements

While the Token Deployer application provides a solid foundation for cross-chain token deployment, there are several areas where improvements can be made:

1. **Support for Additional Chains**: Currently, the application supports the Optimism Sepolia and Base Sepolia testnets. In the future, I plan to add support for more blockchain networks, including mainnet deployments.

2. **Enhanced Token Management**: Implementing features for managing deployed tokens, such as token transfers, approvals, and other ERC20 functionalities, would enhance the application's utility.

3. **Improved Error Handling**: While I have implemented basic error handling, more robust and user-friendly error messaging could be added to improve the overall user experience.

## Proof of testnet interaction
- [Send](https://base-sepolia.blockscout.com/tx/0xbde1aea8bf6c5b9d59eed341900be5058b67f0daadd8ea852ceaa35f2d8f9a0e)
- [Recv](https://optimism-sepolia.blockscout.com/tx/0xc6fcd4029e6ee273bd003c8915e03ccfa11b022f8901bebba31df3bb30979094)
- [Ack](https://base-sepolia.blockscout.com/tx/0x09c09b32e26460152ec556d1fad9f803f5f868b6189297d2a6c5bc9ca2f3499c)

Contracts:
- [PolyErc20factory](https://base-sepolia.blockscout.com/address/0xF24a7a113c85A1886a7B0bb518b8d49b9B5BC062) on Base
- [PolyErc20factory](https://optimism-sepolia.blockscout.com/address/0xF24a7a113c85A1886a7B0bb518b8d49b9B5BC062) on Optimism
- [PolyErc20 token example](https://optimism-sepolia.blockscout.com/token/0x9d6ee42E8eC8450Ce29d9aBcaC9ECc987b97b56D) on Optimism

## License

This project is licensed under the [MIT License](LICENSE).