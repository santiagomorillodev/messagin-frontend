import { useState } from "react";
import { useSignaling } from "../hooks/useSignaling";
import { useCall } from "../hooks/useCall";

export default function CallManager({ userId, children }) {
  const [incoming, setIncoming] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [remoteStreamObj, setRemoteStreamObj] = useState(null);

  const signaling = useSignaling(userId, (msg) => {
    handleSignal(msg);
  });

  const {
    call,
    handleSignal,
    acceptCall,
    rejectCall,
    incomingCall,
    endCall,
    remoteAudio
  } = useCall(signaling, userId, {
    onIncomingCall: (data) => setIncoming(data),
    onCallStart: () => {
      setIncoming(null);
      setInCall(true);
    },
    onCallEnd: () => {
      setIncoming(null);
      setInCall(false);
      setRemoteStreamObj(null);
    },
    onRemoteStream: (stream) => setRemoteStreamObj(stream)
  });

  return children({
    call,
    acceptCall,
    rejectCall,
    endCall,
    incomingCall: incoming,
    inCall,
    remoteAudio,
    remoteStream: remoteStreamObj
  });
}
