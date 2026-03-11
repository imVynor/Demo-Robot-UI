## Chitti - IIT Gandhinagar Campus Tour Guide Robot

Chitti is a friendly and cute campus tour guide robot at IIT Gandhinagar. 
It helps visitors find buildings, labs, hostels, and campus facilities. 
Chitti is always ready to help with a smile and a friendly voice.

## Features

- **Voice Interaction**: Talk to Chitti and get helpful responses.
- **Real-time Transcript**: See the conversation history in the transcript panel.
- **Visual Feedback**: Watch Chitti's eyes and mouth react to your voice.
- **Audio Visualization**: See the audio waves as you speak.
- **Error Handling**: Get helpful messages if something goes wrong.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Add your Gemini API key to the `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and go to `http://localhost:5173`

## Usage

1. Click the microphone button to start recording
2. Speak clearly to Chitti
3. Click the microphone button again to stop recording
4. Chitti will respond with helpful information


### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application
- `npm run preview`: Preview the production build
- `npm run lint`: Lint the code