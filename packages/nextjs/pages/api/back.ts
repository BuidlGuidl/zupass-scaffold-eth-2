import { EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd";
import { ArgumentTypeName } from "@pcd/pcd-types";
import { SemaphoreIdentityPCDPackage } from "@pcd/semaphore-identity-pcd";
import { ZKEdDSAEventTicketPCDPackage } from "@pcd/zk-eddsa-event-ticket-pcd";
import { NextApiRequest, NextApiResponse } from "next";

const validEventIds = ["b03bca82-2d63-11ee-9929-0e084c48e15f"]; //get the event id from https://api.zupass.org/issue/known-ticket-types
const fieldsToReveal = {};
const telegramUserId = "420";

function constructZupassPcdGetRequestUrl<T>(
  zupassClientUrl: string,
  returnUrl: string,
  pcdType: any,
  args: any,
  options?: any,
) {
  const req: any = {
    type: "Get",
    returnUrl: returnUrl,
    args: args,
    pcdType,
    options,
  };
  const encReq = encodeURIComponent(JSON.stringify(req));
  return `${zupassClientUrl}#/prove?request=${encReq}`;
}

const pcdArgs = {
  ticket: {
    argumentType: ArgumentTypeName.PCD,
    pcdType: EdDSATicketPCDPackage.name,
    value: undefined,
    userProvided: true,
    displayName: "Your Ticket",
    description: "",
    validatorParams: {
      eventIds: validEventIds,
      productIds: [],
      // TODO: surface which event ticket we are looking for
      notFoundMessage: "You don't have a ticket to this event.",
    },
    hideIcon: true,
  },
  identity: {
    argumentType: ArgumentTypeName.PCD,
    pcdType: SemaphoreIdentityPCDPackage.name,
    value: undefined,
    userProvided: true,
  },
  fieldsToReveal: {
    argumentType: ArgumentTypeName.ToggleList,
    value: fieldsToReveal,
    userProvided: false,
    hideIcon: true,
  },
  externalNullifier: {
    argumentType: ArgumentTypeName.BigInt,
    value: undefined,
    userProvided: false,
  },
  validEventIds: {
    argumentType: ArgumentTypeName.StringArray,
    value: validEventIds,
    userProvided: false,
  },
  watermark: {
    argumentType: ArgumentTypeName.BigInt,
    value: telegramUserId.toString(),
    userProvided: false,
    description: " This encodes your Telegram user ID so that the proof can grant only you access to the TG group.",
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = constructZupassPcdGetRequestUrl(
    "https://zupass.org",
    "http://localhost:3000/api/verify",
    ZKEdDSAEventTicketPCDPackage.name,
    pcdArgs,
  );

  console.log("result", result);

  res.status(200).json({ message: result });
}
