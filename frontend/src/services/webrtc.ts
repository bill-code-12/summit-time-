import axios from 'axios';
import type { Participant } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

interface RTCConfiguration {
  iceServers: RTCIceServer[];
}

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private ws: WebSocket | null = null;
  private meetingId: string = '';
  private userId: string = '';
  private localStream: MediaStream | null = null;

  constructor(meetingId: string, userId: string) {
    this.meetingId = meetingId;
    this.userId = userId;
  }

  // Initialize WebSocket connection
  async initializeWebSocket(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${WS_URL}/ws/${this.meetingId}?token=${token}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleSignalingMessage(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get local media stream
  async getLocalStream(constraints: MediaStreamConstraints = { audio: true, video: true }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      throw error;
    }
  }

  // Stop local stream
  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }

  // Create peer connection
  async createPeerConnection(remoteUserId: string): Promise<RTCPeerConnection> {
    const peerConnection = new RTCPeerConnection(rtcConfig);

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          from: this.userId,
          to: remoteUserId,
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind);
      // Dispatch event with remote stream
      window.dispatchEvent(
        new CustomEvent('remoteStream', {
          detail: { userId: remoteUserId, stream: event.streams[0] },
        })
      );
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'failed' || peerConnection.connectionState === 'disconnected') {
        this.closePeerConnection(remoteUserId);
      }
    };

    this.peerConnections.set(remoteUserId, peerConnection);
    return peerConnection;
  }

  // Create offer
  async createOffer(remoteUserId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = await this.createPeerConnection(remoteUserId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  // Create answer
  async createAnswer(remoteUserId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const peerConnection = await this.createPeerConnection(remoteUserId);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  }

  // Handle answer
  async handleAnswer(remoteUserId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = this.peerConnections.get(remoteUserId);
    if (!peerConnection) throw new Error('Peer connection not found');
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  // Add ICE candidate
  async addIceCandidate(remoteUserId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.peerConnections.get(remoteUserId);
    if (!peerConnection) throw new Error('Peer connection not found');
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  // Send signaling message via WebSocket
  private sendSignalingMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // Handle signaling message
  private async handleSignalingMessage(message: any): Promise<void> {
    try {
      switch (message.type) {
        case 'offer':
          const answer = await this.createAnswer(message.from, message.offer);
          this.sendSignalingMessage({
            type: 'answer',
            answer,
            from: this.userId,
            to: message.from,
          });
          break;

        case 'answer':
          await this.handleAnswer(message.from, message.answer);
          break;

        case 'ice-candidate':
          await this.addIceCandidate(message.from, message.candidate);
          break;
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
    }
  }

  // Close peer connection
  private closePeerConnection(remoteUserId: string): void {
    const peerConnection = this.peerConnections.get(remoteUserId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(remoteUserId);
    }
  }

  // Cleanup
  cleanup(): void {
    this.stopLocalStream();
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    if (this.ws) {
      this.ws.close();
    }
  }
}
