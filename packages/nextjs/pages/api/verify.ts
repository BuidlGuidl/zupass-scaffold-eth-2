import { ZKEdDSAEventTicketPCDPackage } from "@pcd/zk-eddsa-event-ticket-pcd";
import { NextApiRequest, NextApiResponse } from "next";

const validEventIds = ["b03bca82-2d63-11ee-9929-0e084c48e15f"]; //get the event id from https://api.zupass.org/issue/known-ticket-types

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const proof = req.query && req.query.proof && JSON.parse(decodeURIComponent(req.query.proof as string));
  console.log("proof", proof);

  const deserialized = proof && (await ZKEdDSAEventTicketPCDPackage.deserialize(proof.pcd));
  console.log("deserialized", deserialized);

  if (deserialized) {
    ZKEdDSAEventTicketPCDPackage.verify(deserialized).then(result => {
      console.log("verify result", result);
      if (result) {
        console.log("VALID");

        if (deserialized.claim.validEventIds && deserialized.claim.validEventIds[0] == validEventIds[0]) {
          console.log("AND ALSO THE RIGHT ID");
        }
      } else {
        console.log("INVALID");
      }
    });
  } else {
    console.log("NO PCD DATA");
  }

  res.status(200).json({ message: "DOIT" });
}
