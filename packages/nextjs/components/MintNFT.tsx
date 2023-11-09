import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { generateWitness } from "~~/utils/scaffold-eth/pcd";

export const MintNFT = ({ pcd }: { pcd: string }) => {
  const { data: verifiedResult } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "verifyProof",
    //@ts-expect-error TODO: fix the type later with readlonly fixed lenth bigInt arrays
    args: generateWitness(JSON.parse(pcd)),
  });

  console.log("The verified result is", verifiedResult);
  console.log("MintNFT", pcd && JSON.parse(pcd));
  console.log("MintNFT 1", pcd && generateWitness(JSON.parse(pcd)));
  return (
    <div
      className="tooltip"
      data-tip="When you get back the proof, send it to the contrat so it can verify and mint NFT."
    >
      <button className="btn btn-primary w-full" disabled={!pcd}>
        Mint NFT
      </button>
    </div>
  );
};
