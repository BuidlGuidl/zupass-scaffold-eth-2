# 🏗 Zupass: Scaffold-ETH 2 Starter Kit

Get started with [Zupass](https://github.com/proofcarryingdata/zupass) to generate proofs & verify PCDs (Proof-Carrying Data).

In this Starter Kit you'll find an example of how to generate a proof and verify it on the backend.
- **Frontend** (check `packages/nextjs/pages/index.tsx`):
  - Using `zuauth` we generate a popup where you can generate a proof in your Zupass account.
  - It then sends the PCD to the backend.
- **Backend** (check `packages/nextjs/pages/api/verify.ts`):
  - Verifies the proof received from the frontend.
  - If the proof is valid, it sends 1 ETH to the connected wallet address.

---

![Workflow](.github/img/workflow.png)

---

### 🏃‍♀️ Quick Start

1. Clone the repo
```bash
git clone https://github.com/BuidlGuidl/zupass-scaffold-eth-2
cd zupass
```

2. Install dependencies
```bash
yarn install
```

3. Start the local hardhat chain
```bash
yarn chain
```

4. On a second terminal start the frontend
```bash
yarn start
```

Visit your app on http://localhost:3000/

### Resources

🎥 [Watch the BG & Zupass team first zoom meeting here](https://youtu.be/kwACdt3gRms)


Some links mentioned in the video

https://github.com/proofcarryingdata/zupass

part1)
https://github.com/proofcarryingdata/zupass/blob/main/apps/passport-server/src/services/telegramService.ts#L1104

part2)
https://github.com/proofcarryingdata/zupass/blob/main/apps/passport-server/src/services/telegramService.ts#L554

part3)
https://github.com/proofcarryingdata/zupass/blob/main/apps/passport-server/src/services/telegramService.ts#L736

https://github.com/odyslam/zuzalu-oracle/blob/master/src/ZuzaluOracle.sol
https://api.zupass.org/issue/known-ticket-types
https://github.com/iden3/snarkjs
https://github.com/cedoor/zuauth
https://github.com/cedoor/zuauth/tree/main#-tutorial
https://www.npmjs.com/package/@pcd/passport-interface
https://www.npmjs.com/package/@pcd/zk-eddsa-event-ticket-pcd
https://www.npmjs.com/package/@pcd/eddsa-ticket-pcd
https://www.npmjs.com/package/@pcd/semaphore-identity-pcd
https://www.npmjs.com/package/@pcd/eddsa-ticket-pcd

