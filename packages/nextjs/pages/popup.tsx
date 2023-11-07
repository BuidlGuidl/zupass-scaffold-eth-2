import { usePopup } from "zuauth";

/**
 * This popup sends requests and receives PCDs from the passport.
 */
// TODO: Fix the flickering
export default function Popup() {
  const error = usePopup();

  return <div>{error}</div>;
}
