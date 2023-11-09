import { ZKEdDSAEventTicketPCDPackage } from "@pcd/zk-eddsa-event-ticket-pcd";
import { NextApiRequest, NextApiResponse } from "next";
import { createWalletClient, http, isAddress, parseEther } from "viem";
import { hardhat } from "viem/chains";
import { isZupassPublicKey } from "zupass-auth";

const localWalletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
});

const accounts = await localWalletClient.getAddresses();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pcd = await ZKEdDSAEventTicketPCDPackage.deserialize(req.body.pcd);
  const address = req.body.address;

  // ## Validations
  if (!isAddress(address)) {
    return res.status(401).send("Invalid address");
  }

  if (!(await ZKEdDSAEventTicketPCDPackage.verify(pcd))) {
    console.error(`[ERROR] ZK ticket PCD is not valid`);

    return res.status(401).send("ZK ticket PCD is not valid");
  }

  if (!isZupassPublicKey(pcd.claim.signer)) {
    console.error(`[ERROR] PCD is not signed by Zupass`);

    return res.status(401).send("PCD is not signed by Zupass");
  }

  // TODO: Use real nonce generated by the server
  if (pcd.claim.watermark.toString() !== "1") {
    console.error(`[ERROR] PCD watermark doesn't match`);

    res.status(401).send("PCD watermark doesn't match");
    return;
  }

  // TODO: nullifiers
  // TODO: Check that the event id is the one we expect

  // ## Actions
  // Send ETH to the user. This is just for testing purposes, and it could be any backend action.
  const result = await localWalletClient.sendTransaction({
    to: req.body.address,
    value: parseEther("1"),
    account: accounts[0],
  });

  return res.status(200).json({ message: `🎉 PCD verified! 1 ETH has been sent ${address}!`, txHash: result });
}
