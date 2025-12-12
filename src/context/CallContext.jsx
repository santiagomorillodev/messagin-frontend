import { createContext, useContext } from "react";
import { useSignaling } from "../hooks/useSignaling";
import { useCall as useCallLogic } from "../hooks/useCall";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

const CallContext = createContext(null);
export const useCallContext = () => useContext(CallContext);

export function CallProvider({ children }) {
  const { currentUser } = useGetCurrentUser();

  // Hooks siempre se llaman, aunque currentUser sea undefined
  const signaling = useSignaling(currentUser?.id ?? null, onSignal);
  const callLogic = useCallLogic(signaling, currentUser?.id || null, {
    onCallStart: () => console.log("CALL STARTED"),
    onCallEnd: () => console.log("CALL ENDED"),
    onRemoteStream: () => {},
    onIncomingCall: () => {}
  });

  function onSignal(data) {
    callLogic.handleSignal(data);
  }

  const value = {
    call: callLogic?.call || (() => {}),
    acceptCall: callLogic?.acceptCall || (() => {}),
    rejectCall: callLogic?.rejectCall || (() => {}),
    endCall: callLogic?.endCall || (() => {}),
    incomingCall: callLogic?.incomingCall || null,
    activeCall: null,
    remoteAudio: callLogic?.remoteAudio || useRef(null)
  };


  return (
    <CallContext.Provider value={value}>
      {children}
      {currentUser && <audio ref={callLogic.remoteAudio} autoPlay />}
    </CallContext.Provider>
  );
}
