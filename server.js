const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Handle root path
  let filePath = req.url === '/' 
    ? path.join(__dirname, 'public', 'index.html')
    : path.join(__dirname, 'public', req.url);
  
  // Special route for image upload helper
  if (req.url === '/image-upload') {
    filePath = path.join(__dirname, 'public', 'image-upload.html');
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found, try serving index.html
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading the page');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Create public directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'));
}

// Create index.html with app preview
fs.writeFileSync(
  path.join(__dirname, 'public', 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TerraTime - Grounds Maintenance App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <div class="phone-frame">
      <div class="phone-screen">
        <div class="app-header">
          <h1>TerraTime - Grounds</h1>
        </div>
        
        <div id="login-screen" class="screen active">
          <div class="logo">
            <img src="https://i.imgur.com/Oa3kNRH.png" alt="TerraTime Logo">
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" placeholder="Enter your phone number">
          </div>
          <button id="send-code-btn" class="btn primary">Send Code</button>
          
          <div id="verification-form" class="hidden">
            <div class="form-group">
              <label for="code">Verification Code</label>
              <input type="number" id="code" placeholder="Enter verification code">
            </div>
            <button id="verify-btn" class="btn primary">Verify Code</button>
            <button id="signup-btn" class="btn secondary hidden">Sign Up</button>
          </div>
        </div>
        
        <div id="worker-screen" class="screen">
          <div class="task-grid">
            <div class="task-item" data-task="mowing">
              <img src="https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/mowing.png" alt="Mowing">
              <span>Mowing</span>
            </div>
            <div class="task-item" data-task="trash">
              <img src="https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/trash.png" alt="Trash Collection">
              <span>Trash Collection</span>
            </div>
            <div class="task-item" data-task="trimming">
              <img src="https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/trimming.png" alt="Trimming">
              <span>Trimming</span>
            </div>
            <div class="task-item" data-task="blowing">
              <img src="https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/blowing.png" alt="Leaf Blowing">
              <span>Leaf Blowing</span>
            </div>
            <div class="task-item wide" data-task="safety">
              <img src="https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/safety.png" alt="Safety Inspection">
              <span>Safety Inspection</span>
            </div>
          </div>
        </div>
        
        <div id="task-screen" class="screen">
          <div class="task-details">
            <img id="task-image" src="" alt="Task">
            <h2 id="task-title"></h2>
            <div class="timer">00:00:00</div>
            <div class="task-controls">
              <button id="start-pause-btn" class="btn primary">Start Work</button>
              <button id="stop-btn" class="btn danger hidden">Stop</button>
            </div>
          </div>
        </div>
        
        <div id="task-completion-screen" class="screen">
          <div class="completion-details">
            <h2>Task Completed</h2>
            <p class="completion-summary">
              <span id="completion-task-name"></span>
              <span id="completion-duration"></span>
            </p>
            
            <div class="completion-actions">
              <div class="action-card">
                <img src="https://i.ibb.co/Qf9Vf0F/camera-gear-icon.png" alt="Camera" class="custom-icon">
                <h3>Take Photo</h3>
                <button id="take-photo-btn" class="btn secondary">Take Photo</button>
                <div id="photo-preview" class="preview-container hidden">
                  <img id="photo-preview-img" src="" alt="Photo Preview">
                  <span class="preview-label">Photo added</span>
                </div>
              </div>
              
              <div class="action-card">
                <img src="https://i.ibb.co/Jt1NJcB/microphone-gear-icon.png" alt="Voice" class="custom-icon">
                <h3>Add Voice Note</h3>
                <button id="record-voice-btn" class="btn secondary">Record</button>
                <div id="voice-preview" class="preview-container hidden">
                  <div class="voice-wave">
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <span class="preview-label">Voice note added</span>
                </div>
              </div>
            </div>
            
            <button id="submit-task-btn" class="btn primary">Submit Task</button>
          </div>
        </div>
        
        <div id="supervisor-screen" class="screen">
          <div class="tabs">
            <button class="tab-btn active" data-tab="workers">Workers</button>
            <button class="tab-btn" data-tab="tasks">Tasks</button>
            <button class="tab-btn" data-tab="reports">Reports</button>
          </div>
          
          <div id="workers-tab" class="tab-content active">
            <div class="worker-list">
              <div class="worker-item">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="Worker">
                <div class="worker-info">
                  <h3>John Doe</h3>
                  <p>+1 555-123-4567</p>
                </div>
                <span class="chevron">›</span>
              </div>
              <div class="worker-item">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="Worker">
                <div class="worker-info">
                  <h3>Jane Smith</h3>
                  <p>+1 555-987-6543</p>
                </div>
                <span class="chevron">›</span>
              </div>
            </div>
          </div>
          
          <div id="tasks-tab" class="tab-content">
            <div class="task-list">
              <div class="task-list-item">
                <img src="https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/mowing.png" alt="Mowing">
                <div class="task-info">
                  <h3>John Doe</h3>
                  <p>Mowing</p>
                </div>
                <div class="task-meta">
                  <p>03/01/2025</p>
                  <p>2h 15m</p>
                </div>
              </div>
              <div class="task-list-item">
                <img src="https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/trimming.png" alt="Trimming">
                <div class="task-info">
                  <h3>Jane Smith</h3>
                  <p>Trimming</p>
                </div>
                <div class="task-meta">
                  <p>03/01/2025</p>
                  <p>1h 30m</p>
                </div>
              </div>
            </div>
          </div>
          
          <div id="reports-tab" class="tab-content">
            <p class="coming-soon">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="helper-links">
    <a href="/image-upload" target="_blank">Image Upload Helper</a>
  </div>
  <script src="app.js"></script>
</body>
</html>`
);

// Create CSS file
fs.writeFileSync(
  path.join(__dirname, 'public', 'styles.css'),
  `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

body {
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.phone-frame {
  background-color: #111;
  border-radius: 40px;
  padding: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.phone-screen {
  background-color: #f9f9f9;
  border-radius: 30px;
  overflow: hidden;
  height: 700px;
  position: relative;
}

.app-header {
  background-color: #22c55e;
  color: white;
  padding: 15px;
  text-align: center;
}

.app-header h1 {
  font-size: 18px;
  font-weight: 600;
}

.screen {
  display: none;
  padding: 20px;
  height: calc(100% - 50px);
  overflow-y: auto;
}

.screen.active {
  display: block;
}

.logo {
  text-align: center;
  margin: 20px 0;
}

.logo img {
  width: 100px;
  height: 100px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.btn {
  display: block;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  margin-bottom: 10px;
}

.primary {
  background-color: #22c55e;
  color: white;
}

.secondary {
  background-color: #3b82f6;
  color: white;
}

.danger {
  background-color: #ef4444;
  color: white;
}

.toggle-container {
  display: flex;
  margin-top: 20px;
  gap: 10px;
}

.toggle {
  flex: 1;
  background-color: #e5e7eb;
  color: #4b5563;
}

.toggle.active {
  background-color: #22c55e;
  color: white;
}

.hidden {
  display: none;
}

/* Worker Screen */
.task-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 10px;
}

.task-item {
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.task-item.wide {
  grid-column: span 2;
}

.task-item img {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.task-item span {
  font-weight: 500;
}

/* Task Screen */
.task-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.task-details img {
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
}

.timer {
  font-size: 36px;
  font-weight: 700;
  margin: 20px 0;
}

.task-controls {
  width: 100%;
}

/* Task Completion Screen */
.completion-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.completion-details h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #22c55e;
}

.completion-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #4b5563;
}

.completion-actions {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  margin-bottom: 20px;
}

.action-card {
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-card img {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.custom-icon {
  width: 80px !important;
  height: 80px !important;
  object-fit: contain;
}

.action-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.preview-container {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background-color: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#photo-preview-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 5px;
}

.preview-label {
  font-size: 14px;
  color: #4b5563;
}

.voice-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100%;
  margin-bottom: 5px;
}

.voice-wave span {
  display: inline-block;
  width: 5px;
  height: 20px;
  margin: 0 3px;
  background-color: #3b82f6;
  border-radius: 3px;
  animation: wave 1s infinite ease-in-out;
}

.voice-wave span:nth-child(2) {
  animation-delay: 0.1s;
  height: 30px;
}

.voice-wave span:nth-child(3) {
  animation-delay: 0.2s;
  height: 40px;
}

.voice-wave span:nth-child(4) {
  animation-delay: 0.3s;
  height: 30px;
}

.voice-wave span:nth-child(5) {
  animation-delay: 0.4s;
  height: 20px;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

/* Supervisor Screen */
.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
}

.tab-btn.active {
  color: #22c55e;
  border-bottom: 2px solid #22c55e;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.worker-list, .task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.worker-item, .task-list-item {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.worker-item img, .task-list-item img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.worker-info, .task-info {
  flex: 1;
}

.worker-info h3, .task-info h3 {
  font-size: 16px;
  margin-bottom: 2px;
}

.worker-info p, .task-info p {
  font-size: 14px;
  color: #6b7280;
}

.chevron {
  font-size: 24px;
  color: #9ca3af;
}

.task-meta {
  text-align: right;
}

.task-meta p {
  font-size: 14px;
  color: #6b7280;
}

.coming-soon {
  text-align: center;
  color: #6b7280;
  margin-top: 50px;
  font-size: 18px;
}

.helper-links {
  margin-top: 20px;
}

.helper-links a {
  display: inline-block;
  background-color: #22c55e;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  margin: 5px;
}`
);

// Create JavaScript file
fs.writeFileSync(
  path.join(__dirname, 'public', 'app.js'),
  `// Mock data
const mockUsers = [
  { id: 'user1', phone: '+15551234567', role: 'worker', language: 'en' },
  { id: 'user2', phone: '+15559876543', role: 'supervisor', language: 'en' }
];

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const workerScreen = document.getElementById('worker-screen');
const taskScreen = document.getElementById('task-screen');
const taskCompletionScreen = document.getElementById('task-completion-screen');
const supervisorScreen = document.getElementById('supervisor-screen');

const phoneInput = document.getElementById('phone');
const sendCodeBtn = document.getElementById('send-code-btn');
const verificationForm = document.getElementById('verification-form');
const codeInput = document.getElementById('code');
const verifyBtn = document.getElementById('verify-btn');
const signupBtn = document.getElementById('signup-btn');

const taskItems = document.querySelectorAll('.task-item');
const taskImage = document.getElementById('task-image');
const taskTitle = document.getElementById('task-title');
const startPauseBtn = document.getElementById('start-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const timerDisplay = document.querySelector('.timer');

// Task completion elements
const completionTaskName = document.getElementById('completion-task-name');
const completionDuration = document.getElementById('completion-duration');
const takePhotoBtn = document.getElementById('take-photo-btn');
const photoPreview = document.getElementById('photo-preview');
const photoPreviewImg = document.getElementById('photo-preview-img');
const recordVoiceBtn = document.getElementById('record-voice-btn');
const voicePreview = document.getElementById('voice-preview');
const submitTaskBtn = document.getElementById('submit-task-btn');

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// State
let isSigningUp = false;
let isVerifying = false;
let currentUser = null;
let currentTask = null;
let timerInterval = null;
let startTime = null;
let elapsedTime = 0;
let pausedTime = 0;
let isRunning = false;
let hasPhoto = false;
let hasVoiceNote = false;
let isRecording = false;

// Functions
function showScreen(screen) {
  loginScreen.classList.remove('active');
  workerScreen.classList.remove('active');
  taskScreen.classList.remove('active');
  taskCompletionScreen.classList.remove('active');
  supervisorScreen.classList.remove('active');
  
  screen.classList.add('active');
}

function sendVerificationCode() {
  const phone = phoneInput.value.trim();
  
  if (!phone) {
    alert('Please enter a phone number');
    return;
  }
  
  // Check if user exists
  const formattedPhone = phone.startsWith('+') ? phone : '+1' + phone;
  const userExists = mockUsers.some(u => u.phone === formattedPhone);
  
  // Show signup button if user doesn't exist
  if (!userExists) {
    signupBtn.classList.remove('hidden');
  } else {
    signupBtn.classList.add('hidden');
  }
  
  // Mock verification code
  const verificationCode = '123456';
  alert(\`Your verification code is: \${verificationCode}\`);
  
  verificationForm.classList.remove('hidden');
  isVerifying = true;
}

function verifyCode() {
  const code = codeInput.value.trim();
  
  if (!code) {
    alert('Please enter the verification code');
    return;
  }
  
  // Mock verification (in a real app, this would validate against a server)
  if (code === '123456') {
    const phone = phoneInput.value.trim();
    const formattedPhone = phone.startsWith('+') ? phone : '+1' + phone;
    
    // Check if user exists
    const user = mockUsers.find(u => u.phone === formattedPhone);
    
    if (user) {
      // Login successful
      currentUser = user;
      
      if (user.role === 'worker') {
        showScreen(workerScreen);
      } else if (user.role === 'supervisor') {
        showScreen(supervisorScreen);
      }
    } else {
      // User doesn't exist, show signup button
      signupBtn.classList.remove('hidden');
      alert('No account found. Please sign up.');
    }
  } else {
    alert('Invalid verification code');
  }
}

function signup() {
  isSigningUp = true;
  
  // Create new user (mock)
  const phone = phoneInput.value.trim();
  const formattedPhone = phone.startsWith('+') ? phone : '+1' + phone;
  
  const newUser = {
    id: 'user' + Date.now(),
    phone: formattedPhone,
    role: 'worker', // Default role
    language: 'en' // Default language
  };
  
  mockUsers.push(newUser);
  currentUser = newUser;
  showScreen(workerScreen);
}

function selectTask(taskType) {
  currentTask = taskType;
  
  // Set task details
  const taskImages = {
    mowing: 'https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/mowing.png',
    trash: 'https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/trash.png',
    trimming: 'https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/trimming.png',
    blowing: 'https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/blowing.png',
    safety: 'https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-images@main/safety.png'
  };
  
  const taskTitles = {
    mowing: 'Mowing',
    trash: 'Trash Collection',
    trimming: 'Trimming',
    blowing: 'Leaf Blowing',
    safety: 'Safety Inspection'
  };
  
  taskImage.src = taskImages[taskType];
  taskTitle.textContent = taskTitles[taskType];
  
  // Reset timer
  resetTimer();
  
  // Show task screen
  showScreen(taskScreen);
}

function toggleTimer() {
  if (!isRunning) {
    startTimer();
    startPauseBtn.textContent = 'Pause';
    startPauseBtn.classList.remove('primary');
    startPauseBtn.classList.add('danger');
    stopBtn.classList.remove('hidden');
  } else {
    pauseTimer();
    startPauseBtn.textContent = 'Resume';
    startPauseBtn.classList.add('primary');
    startPauseBtn.classList.remove('danger');
  }
}

function startTimer() {
  if (!startTime) {
    startTime = new Date();
  }
  
  isRunning = true;
  
  timerInterval = setInterval(() => {
    const now = new Date();
    elapsedTime = now.getTime() - startTime.getTime() - pausedTime;
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    pausedTime += new Date().getTime() - startTime.getTime();
  }
  
  isRunning = false;
}

function stopTimer() {
  pauseTimer();
  
  // Show task completion screen
  showTaskCompletionScreen();
}

function showTaskCompletionScreen() {
  // Set task completion details
  completionTaskName.textContent = taskTitle.textContent;
  completionDuration.textContent = \`Duration: \${timerDisplay.textContent}\`;
  
  // Reset photo and voice note
  hasPhoto = false;
  hasVoiceNote = false;
  photoPreview.classList.add('hidden');
  voicePreview.classList.add('hidden');
  
  // Show completion screen
  showScreen(taskCompletionScreen);
}

function takePhoto() {
  // In a real app, this would access the device camera
  // For demo, we'll use a placeholder image
  photoPreviewImg.src = 'https://picsum.photos/400/300';
  photoPreview.classList.remove('hidden');
  hasPhoto = true;
}

function recordVoice() {
  if (isRecording) {
    // Stop recording
    recordVoiceBtn.textContent = 'Record';
    voicePreview.classList.remove('hidden');
    isRecording = false;
    hasVoiceNote = true;
  } else {
    // Start recording
    recordVoiceBtn.textContent = 'Stop Recording';
    isRecording = true;
    
    // In a real app, this would start recording audio
    // For demo, we'll simulate a short recording
    setTimeout(() => {
      if (isRecording) {
        recordVoice(); // Stop recording after 3 seconds
      }
    }, 3000);
  }
}

function submitTask() {
  // In a real app, this would save the task data to the server
  
  // Create a message based on what was included
  let message = \`Task submitted: \${completionTaskName.textContent}\\nDuration: \${timerDisplay.textContent}\`;
  
  if (hasPhoto) {
    message += '\\nPhoto included';
  }
  
  if (hasVoiceNote) {
    message += '\\nVoice note included';
  }
  
  alert(message);
  
  // Reset and return to worker screen
  resetTimer();
  showScreen(workerScreen);
}

function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  startTime = null;
  elapsedTime = 0;
  pausedTime = 0;
  isRunning = false;
  
  updateTimerDisplay();
  
  startPauseBtn.textContent = 'Start Work';
  startPauseBtn.classList.add('primary');
  startPauseBtn.classList.remove('danger');
  stopBtn.classList.add('hidden');
}

function updateTimerDisplay() {
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  
  timerDisplay.textContent = \`\${hours.toString().padStart(2, '0')}:\${
    minutes.toString().padStart(2, '0')}:\${
    seconds.toString().padStart(2, '0')}\`;
}

function switchTab(tabName) {
  // Update tab buttons
  tabButtons.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update tab content
  tabContents.forEach(content => {
    if (content.id === \`\${tabName}-tab\`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

// Event Listeners
sendCodeBtn.addEventListener('click', sendVerificationCode);
verifyBtn.addEventListener('click', verifyCode);
signupBtn.addEventListener('click', signup);

taskItems.forEach(item => {
  item.addEventListener('click', () => {
    selectTask(item.dataset.task);
  });
});

startPauseBtn.addEventListener('click', toggleTimer);
stopBtn.addEventListener('click', stopTimer);

takePhotoBtn.addEventListener('click', takePhoto);
recordVoiceBtn.addEventListener('click', recordVoice);
submitTaskBtn.addEventListener('click', submitTask);

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// Initialize
showScreen(loginScreen);`
);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Image upload helper available at http://localhost:${PORT}/image-upload`);
});