import React, { useEffect, useRef } from 'react';
import './App.css';
import { useRobotState } from './hooks/useRobotState';
import { useVoiceInteraction } from './hooks/useVoiceInteraction';
import { RobotFace } from './components/RobotFace';
import { AudioVisualizer } from './components/AudioVisualizer';
import { MicButton } from './components/MicButton';

function App() {
  const { robotState, transitionTo } = useRobotState();
  const {
    isRecording,
    startVoiceInteraction,
    stopVoiceInteraction,
    error,
    conversation
  } = useVoiceInteraction(transitionTo);

  const transcriptEndRef = useRef(null);
  useEffect(() => {
    document.title = "Chitti";
  }, []);

  
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className="app">
      <div className="main-content">
        <div className="status-container">
          <div className="status-label">Robot State</div>
          <div className="status-value">{robotState.mode}</div>
        </div>

        <RobotFace robotState={robotState} />

        <AudioVisualizer robotState={robotState} />

        <MicButton
          isRecording={isRecording}
          onStart={startVoiceInteraction}
          onStop={stopVoiceInteraction}
          disabled={robotState.mode === 'Thinking' || robotState.mode === 'Talking'}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      <div className="transcript-panel">
        <div className="transcript-header">Conversation Transcript</div>
        <div className="transcript-list">
          {conversation.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-sender">{msg.role === 'user' ? 'You' : 'Chitti'}</div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
