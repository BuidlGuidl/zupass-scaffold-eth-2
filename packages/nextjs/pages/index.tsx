import { useCallback } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useZuAuth } from "zupass-auth";
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
        <p className="font-bold m-0">Verified!</p>
        <p className="m-0">{data?.message}</p>
      </>,
    );
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center mt-24">
        <div className="card max-w-[90%] sm:max-w-lg bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Zupass: Scaffold-ETH 2 Starter Kit</h2>
            <p className="mt-0">
              Get started with{" "}
              <a className="link" href="https://github.com/proofcarryingdata/zupass" target="_blank">
                Zupass
              </a>{" "}
              to verify PCDs (Proof-Carrying Data). <span className="font-bold">e.g.</span> Devconnect tickets.
            </p>
            <p className="text-sm m-0">
              - Check
              <code className="mx-1 px-1 italic bg-base-300 font-bold max-w-full break-words break-all inline-block">
                packages/nextjs/pages/index.tsx
              </code>
              to learn how to ask Zupass for a zero knowledge proof.
            </p>
            <p className="text-sm m-0">
              - Check
              <code className="mx-1 px-1 italic bg-base-300 font-bold max-w-full break-words break-all inline-block">
                packages/nextjs/pages/api/verify.tsx
              </code>
              to learn how to verify the proof on the backend and execute any action (in this example it will send 1 ETH
              to the connected address).
            </p>
            <div className="flex flex-col gap-4 mt-6">
              <div className="tooltip" data-tip="Loads the Zupass UI in a modal, where you can prove your PCD.">
                <button className="btn btn-secondary w-full tooltip" onClick={getProof} disabled={!!pcd}>
                  {!pcd ? "1. Get Proof" : "1. Proof Received!"}
                </button>
              </div>
              <div
                className="tooltip"
                data-tip="When you get back the proof, send it to the server so it can verify it."
              >
                <button className="btn btn-primary w-full" disabled={!pcd} onClick={sendPCDToServer}>
                  2. Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
