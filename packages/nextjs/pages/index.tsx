import { useCallback } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useZuAuth } from "zuauth";
import { MetaHeader } from "~~/components/MetaHeader";

//TODO: Fix the flickering

// const validEventIds = undefined; //get the event id from https://api.zupass.org/issue/known-ticket-types
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
  const { address: connectedAddres } = useAccount();

  console.log("pcd", pcd);

  const getProof = useCallback(async () => {
    authenticate(fieldsToReveal, nonce);
  }, [authenticate]);

  const sendPCDToServer = async () => {
    //TODO: Wrap this in TRY/CATCH
    const res = await fetch("/api/verify", {
      method: "POST",
      body: JSON.stringify({
        pcd: pcd,
        address: connectedAddres,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log("data", data);
  };

  return (
    <>
      <MetaHeader />
      <div>
        <button className="btn btn-primary m-4" onClick={getProof}>
          Get proof
        </button>

        <button disabled={!pcd} onClick={sendPCDToServer}>
          Verify
        </button>
      </div>
    </>
  );
};

export default Home;
