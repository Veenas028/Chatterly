import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import socket from "../lib/socket";

const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const CallPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);

  /* ======================
     START CALL (CALLER)
  ====================== */
  const startCall = async () => {
    setCallStarted(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = stream;

    const peer = new RTCPeerConnection(iceServers);
    peerRef.current = peer;

    stream.getTracks().forEach((track) =>
      peer.addTrack(track, stream)
    );

    peer.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          conversationId,
          candidate: e.candidate,
        });
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("call-user", {
      conversationId,
      offer,
    });
  };

  /* ======================
     SOCKET SIGNALING
  ====================== */
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("incoming-call", async ({ offer }) => {
      setCallStarted(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;

      const peer = new RTCPeerConnection(iceServers);
      peerRef.current = peer;

      stream.getTracks().forEach((track) =>
        peer.addTrack(track, stream)
      );

      peer.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
      };

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            conversationId,
            candidate: e.candidate,
          });
        }
      };

      await peer.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answer-call", {
        conversationId,
        answer,
      });
    });

    socket.on("call-answered", async ({ answer }) => {
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", ({ candidate }) => {
      peerRef.current?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
    };
  }, [conversationId]);

  /* ======================
     END CALL
  ====================== */
  const endCall = () => {
    peerRef.current?.close();
    peerRef.current = null;

    [localVideoRef, remoteVideoRef].forEach((ref) => {
      ref.current?.srcObject?.getTracks().forEach((t) => t.stop());
      ref.current.srcObject = null;
    });

    navigate(-1);
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="h-screen bg-black relative">

      {/* REMOTE VIDEO */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* LOCAL VIDEO */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-40 h-40 absolute bottom-20 right-4 rounded-lg border"
      />

      {/* CONTROLS */}
      <div className="absolute bottom-6 w-full flex justify-center gap-6">
        {!callStarted && (
          <button
            onClick={startCall}
            className="bg-green-500 px-6 py-3 rounded-full text-white"
          >
            Start Call
          </button>
        )}

        <button
          onClick={endCall}
          className="bg-red-500 px-6 py-3 rounded-full text-white"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default CallPage;
