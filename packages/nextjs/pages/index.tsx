import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd";
import { ArgumentTypeName } from "@pcd/pcd-types";
import { SemaphoreIdentityPCDPackage } from "@pcd/semaphore-identity-pcd";
import { ZKEdDSAEventTicketPCD, ZKEdDSAEventTicketPCDPackage } from "@pcd/zk-eddsa-event-ticket-pcd";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const validEventIds = ["b03bca82-2d63-11ee-9929-0e084c48e15f"]; //get the event id from https://api.zupass.org/issue/known-ticket-types
const fieldsToReveal = {};
const telegramUserId = "420";

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

const Home: NextPage = () => {
  const { query } = useRouter();

  const [pcdData, setPcdData] = useState<ZKEdDSAEventTicketPCD>();

  const proof = query && query.proof && JSON.parse(decodeURIComponent(query.proof as string));
  console.log("proof", proof);

  useEffect(() => {
    const doDeserialization = async () => {
      const deserialized = proof && (await ZKEdDSAEventTicketPCDPackage.deserialize(proof.pcd));
      console.log("deserialized", deserialized);
      setPcdData(deserialized);
    };
    if (proof) {
      doDeserialization();
    }
  }, [proof]);

  return (
    <>
      <MetaHeader />
      <div>
        <button
          className="btn btn-primary m-4"
          onClick={() => {
            const result = constructZupassPcdGetRequestUrl(
              "https://zupass.org",
              "http://localhost:3000/",
              ZKEdDSAEventTicketPCDPackage.name,
              pcdArgs,
            );

            console.log("result", result);

            window.location.href = result; //or you could have a pop up but it's more complicated
          }}
        >
          CLICK TO GET PROOF
        </button>

        <button
          className="btn btn-primary m-4"
          onClick={() => {
            if (pcdData) {
              ZKEdDSAEventTicketPCDPackage.verify(pcdData).then(result => {
                console.log("verify result", result);
                if (result) {
                  alert("VALID");

                  if (pcdData.claim.validEventIds && pcdData.claim.validEventIds[0] == validEventIds[0]) {
                    alert("AND ALSO THE RIGHT ID");
                  }
                } else {
                  alert("INVALID");
                }
              });
            } else {
              alert("NO PCD DATA");
            }
          }}
        >
          VERIFY
        </button>
      </div>
    </>
  );
};

export default Home;
