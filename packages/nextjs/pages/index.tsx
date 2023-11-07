import { useCallback } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useZuAuth } from "zuauth";
import { MetaHeader } from "~~/components/MetaHeader";
import { notification } from "~~/utils/scaffold-eth";

// Get a valid event id from { supportedEvents } from "zuauth" or https://api.zupass.org/issue/known-ticket-types
const validEventIds = undefined;
const fieldsToReveal = {
  revealAttendeeEmail: true,
  revealEventId: true,
  revealProductId: true,
};
// This should be a real nonce. Could be the same? (like Telegram UserId)
const nonce = "1";

const Home: NextPage = () => {
  const { authenticate, pcd } = useZuAuth();
  const { address: connectedAddress } = useAccount();

  const getProof = useCallback(async () => {
    authenticate(fieldsToReveal, nonce, validEventIds);
  }, [authenticate]);

  const sendPCDToServer = async () => {
    let response;
    try {
      response = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({
          pcd: pcd,
          address: connectedAddress,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      notification.error(`Error: ${e}`);
      return;
    }

    const data = await response.json();
    notification.success(
      <>
        <p className="font-bold">Verified</p>
        <p>{data?.message}</p>
      </>,
    );
  };

  // ToDo. Better UI (Card + zupass info)
  return (
    <>
      <MetaHeader />
      <div>
        <button className="btn btn-primary m-4" onClick={getProof}>
          Get Proof
        </button>

        <button disabled={!pcd} onClick={sendPCDToServer}>
          Verify
        </button>
      </div>
    </>
  );
};

export default Home;
