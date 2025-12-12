import { useRef, useState, useEffect } from "react";

export function useCall(signaling, userId, options = {}) {
  const { onCallStart, onCallEnd, onRemoteStream, onIncomingCall } = options;

  const pc = useRef(null);
  const localStream = useRef(null);
  const remoteAudio = useRef(null);

  const [incomingCall, setIncomingCall] = useState(null);
  const currentTarget = useRef(null);
  const pendingICE = useRef([]);

  function safeCall(fn, ...args) {
    if (typeof fn === "function") fn(...args);
  }

  function createPeerConnection() {
    if (pc.current) pc.current.close();

    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.current.ontrack = (event) => {
      if (remoteAudio.current) {
        remoteAudio.current.srcObject = event.streams[0];
      }
      safeCall(onRemoteStream, event.streams[0]);
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate && currentTarget.current) {
        signaling.send({
          type: "ice",
          from: userId,
          target: currentTarget.current,
          ice: event.candidate
        });
      }
    };
  }

  async function setupLocalMedia() {
    if (!localStream.current) {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
    }

    localStream.current.getTracks().forEach((t) => {
      pc.current.addTrack(t, localStream.current);
    });
  }

  async function call(targetId) {
    currentTarget.current = targetId;
    createPeerConnection();
    await setupLocalMedia();
    console.log('llamando al usuario: ',targetId)
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    signaling.send({
      type: "offer",
      from: userId,
      target: targetId,
      offer
    });
  }

  async function acceptCall() {
    if (!incomingCall) return;

    createPeerConnection();
    await setupLocalMedia();

    currentTarget.current = incomingCall.from;
    await pc.current.setRemoteDescription(incomingCall.offer);

    for (const ice of pendingICE.current) {
      await pc.current.addIceCandidate(ice);
    }
    pendingICE.current = [];

    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    signaling.send({
      type: "answer",
      from: userId,
      target: incomingCall.from,
      answer
    });

    setIncomingCall(null);
    safeCall(onCallStart);
  }

  function rejectCall() {
    if (!incomingCall) return;

    signaling.send({
      type: "reject",
      from: userId,
      target: incomingCall.from
    });
    setIncomingCall(null);
  }

  function endCall() {
    if (currentTarget.current) {
      signaling.send({
        type: "end",
        from: userId,
        target: currentTarget.current
      });
    }

    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }

    currentTarget.current = null;
    pendingICE.current = [];
    setIncomingCall(null);

    safeCall(onCallEnd);
  }

  async function handleSignal(data) {
    switch (data.type) {
      case "offer":
        setIncomingCall(data);
        safeCall(onIncomingCall, data); // 🔹 Notifica al componente que hay una llamada entrante
        break;

      case "answer":
        if (pc.current) {
          await pc.current.setRemoteDescription(data.answer);
        }
        safeCall(onCallStart);
        break;

      case "ice":
        if (pc.current && pc.current.remoteDescription) {
          await pc.current.addIceCandidate(data.ice);
        } else {
          pendingICE.current.push(data.ice);
        }
        break;

      case "reject":
        safeCall(onCallEnd);
        setIncomingCall(null);
        break;

      case "end":
        endCall();
        break;

      default:
        break;
    }
  }

  return {
    call,
    handleSignal,
    acceptCall,
    rejectCall,
    incomingCall,
    endCall,
    remoteAudio
  };
}
