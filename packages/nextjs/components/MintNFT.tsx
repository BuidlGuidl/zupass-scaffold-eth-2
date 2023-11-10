import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { generateWitness } from "~~/utils/scaffold-eth/pcd";

export const MintNFT = ({ pcd }: { pcd: string }) => {
  const { address: connectedAddress } = useAccount();
  const { writeAsync: mintNFT } = useScaffoldContractWrite({
    contractName: "YourCollectible",
    functionName: "mintItem",
    //@ts-expect-error TODO: fix the type later with readlonly fixed length bigInt arrays
    args: [connectedAddress, generateWitness(JSON.parse(pcd))],
  });

  console.log("MintNFT", pcd && JSON.parse(pcd));
  console.log("MintNFT 1", pcd && generateWitness(JSON.parse(pcd)));
  return (
    <div
      className="tooltip"
      data-tip="When you get back the proof, send it to the contrat so it can verify and mint NFT."
    >
      <button
        className="btn btn-primary w-full"
        disabled={!pcd}
        onClick={async () => {
          await mintNFT();
        }}
      >
        Mint NFT
      </button>
    </div>
  );
};
