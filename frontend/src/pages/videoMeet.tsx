import { useRef, useState } from "react";

import '../styles/videoComponent.css';
const server_url = "http://localhost:8000";

const peerConfigConnections = {
  "iceServers": [
    {
      "urls": "stun:stun.l.google.com:19302"
    }
  ]
}


export default function VideoMeetComponent() {

  const socketRef = useRef<any>(null);
  let socketIdRef = useRef<string | null>(null);
  
  let localVideoRef = useRef<HTMLVideoElement | null>(null);

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState();
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setModal] = useState();
  let [screenAvailable, setScreenAvailable] = useState();
  let [message, setMessage] = useState("");
  let [messages, setMessages] = useState([]);
  let [newMessage, setNewMessage] = useState(0);
  let [askForUsername, setAskForUsername ] = useState(true );
  let [username, setUsername] = useState("");

  const vidRef = useRef([]);
  let [videos, setVideos] = useState([]);

  



  return (
    <div>
      { askForUsername === true ? 
        <div>
          <h2> enter into lobby </h2>

        </div> : null
      }
    </div>
  )
}

