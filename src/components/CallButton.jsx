import { useCallContext } from "../context/CallContext";

export default function CallButton({ targetId }) {
  const { call } = useCallContext();
  return (
    <button onClick={() => call(targetId)}>
      <i className="bx bx-phone text-3xl"></i>
    </button>
  );
}
