import { usePopup } from "zupass-auth";

/**
 * This popup sends requests and receives PCDs from the passport.
 */
export default function Popup() {
  const error = usePopup();

  return <div className="absolute w-100 h-100 bg-white">{error}</div>;
}
