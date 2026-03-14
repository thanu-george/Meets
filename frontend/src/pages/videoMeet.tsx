import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "../styles/videoComponent.css";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button/Button";

const server_url = "http://localhost:8000";

const peerConfigConnections = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const connections: { [socketId: string]: RTCPeerConnection } = {};

export default function VideoMeetComponent() {
  const socketRef = useRef<Socket | null>(null);
  const socketIdRef = useRef<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState<boolean>(true);
  const [audio, setAudio] = useState<boolean>(true);
  const [screen, setScreen] = useState<boolean>(false);
  const [showModal, setModal] = useState<boolean>(false);
  const [screenAvailable, setScreenAvailable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<number>(0);
  const [askForUsername, setAskForUsername] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");

  const vidRef = useRef<HTMLVideoElement[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const hasVideo = !!videoPermission;
      setVideoAvailable(hasVideo);

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const hasAudio = !!audioPermission;
      setAudioAvailable(hasAudio);

      if ("getDisplayMedia" in navigator.mediaDevices) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (hasVideo || hasAudio) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: hasVideo,
          audio: hasAudio,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const getUserMediaSuccess = (stream: MediaStream) => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video, audio })
        .then(getUserMediaSuccess)
        .catch((err) => {
          console.log(err);
        });
    } else {
      try {
        const mediaStream = localVideoRef.current?.srcObject as MediaStream | null;
        const tracks = mediaStream?.getTracks();
        tracks?.forEach((track) => track.stop());
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }

    return () => {
      const mediaStream = localVideoRef.current?.srcObject as MediaStream | null;
      mediaStream?.getTracks().forEach((t) => t.stop());
    };
  }, [video, audio]);

  const gotMessageFromServer = (message: any) => {
    // TODO: handle signaling messages
  };

  const addMessage = (message: any) => {
    // TODO: update messages state
  };

// 1) define getMedia
const getMedia = () => {
  setVideo(true);
  setAudio(true);
  // getUserMedia() will run via useEffect
};

// 2) define connect
const connect = () => {
  setAskForUsername(false);
  getMedia();
  connectToSocketServer();
};

// 3) define connectToSocketServer (no nested getMedia / connect)
const connectToSocketServer = () => {
  socketRef.current = io(server_url, { secure: false });

  socketRef.current.on("signal", gotMessageFromServer);

  socketRef.current.on("connect", () => {
    socketRef.current?.emit("join-call", window.location.href);
    socketIdRef.current = socketRef.current?.id ?? null;

    socketRef.current?.on("chat-message", addMessage);

    socketRef.current?.on("user-left", (id: string) => {
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.socketId !== id)
      );
    });

    socketRef.current?.on("user-joined", (id: string, clients: string[]) => {
      clients.forEach((socketListId: string) => {
        if (!connections[socketListId]) {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
        }

        const pc = connections[socketListId];

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit(
              "signal",
              socketListId,
              JSON.stringify({ ice: event.candidate })
            );
          }
        };

        pc.ontrack = (event: RTCTrackEvent) => {
          const remoteStream =
            event.streams && event.streams[0]
              ? event.streams[0]
              : new MediaStream([event.track]);

          const videoExists = videos.some(
            (video) => video.socketId === socketListId
          );

          if (videoExists) {
            setVideos((prevVideos) =>
              prevVideos.map((video) =>
                video.socketId === socketListId
                  ? { ...video, stream: remoteStream }
                  : video
              )
            );
          } else {
            const newVideo = {
              socketId: socketListId,
              stream: remoteStream,
              autoPlay: true,
              playsinline: true,
            };

            setVideos((prevVideos) => [...prevVideos, newVideo]);
          }
        };

        if (window.localStream) {
          window.localStream.getTracks().forEach((track) => {
            pc.addTrack(track, window.localStream as MediaStream);
          });
        }
      });

      if (id === socketIdRef.current) {
        for (const id2 in connections) {
          if (id2 === socketIdRef.current) continue;

          const pc = connections[id2];

          if (window.localStream) {
            window.localStream.getTracks().forEach((track) => {
              pc.addTrack(track, window.localStream as MediaStream);
            });
          }

          pc
            .createOffer()
            .then((description) =>
              pc.setLocalDescription(description).then(() => {
                socketRef.current?.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: pc.localDescription })
                );
              })
            )
            .catch((e) => console.log(e));
        }
      }
    });
  });
};



  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h2> enter into lobby </h2>
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>

          <div>
            <video ref={localVideoRef} autoPlay muted />
          </div>
        </div>
      ) : null}
    </div>
  );
}
