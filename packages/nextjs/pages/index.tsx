import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ZKEdDSAEventTicketPCD, ZKEdDSAEventTicketPCDPackage } from "@pcd/zk-eddsa-event-ticket-pcd";
import type { NextPage } from "next";
import { useZuAuth } from "zuauth";
import { MetaHeader } from "~~/components/MetaHeader";

const validEventIds = undefined; //get the event id from https://api.zupass.org/issue/known-ticket-types
// const validEventIds = ["b03bca82-2d63-11ee-9929-0e084c48e15f"]; //get the event id from https://api.zupass.org/issue/known-ticket-types
const fieldsToReveal = {
  revealAttendeeEmail: true,
  revealEventId: true,
  revealProductId: true,
};
// This should be a real nonce. Could be the same? (like Telegram User Id)
const nonce = "1";

const Home: NextPage = () => {
  const { authenticate, pcd } = useZuAuth();
  const { query } = useRouter();

  const [pcdData, setPcdData] = useState<ZKEdDSAEventTicketPCD>();

  const proof = query && query.proof && JSON.parse(decodeURIComponent(query.proof as string));
  console.log("proof & pcd", proof, pcd);

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

  const getProof = useCallback(async () => {
    authenticate(fieldsToReveal, nonce);
  }, [authenticate]);

  return (
    <>
      <MetaHeader />
      <div>
        <button className="btn btn-primary m-4" onClick={getProof}>
          Get proof
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
          Verify
        </button>
      </div>
    </>
  );
};

export default Home;
