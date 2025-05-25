# 🏥 CareSight - Medical Accessibility Assistant

**CareSight** is an AI-powered healthcare assistant designed specifically for elderly, disabled, and neurodiverse users. It simplifies medical information, provides accessible interfaces, and includes comprehensive care coordination features.

## ✨ Features

### 🔍 **Document Scanner & OCR**
- Real-time OCR processing with Tesseract.js
- Simplifies medical documents into plain language
- Text-to-speech for easy listening
- Supports prescriptions, lab results, and medical forms

### 💬 **AI Medical Assistant**
- Google Gemini AI integration with medical-focused prompts
- Simple, elderly-friendly explanations
- Voice input and output capabilities
- Educational information with healthcare provider reminders

### ♿ **Care Mode Accessibility**
- Larger text and buttons for easy reading
- High contrast mode for better visibility
- Slower, patient voice synthesis
- Simplified navigation with essential features

### 🚨 **Emergency & Care Coordination**
- Real EmailJS integration for caregiver alerts
- SMS simulation (ready for Twilio integration)
- Emergency and general alert types
- One-click contact system

### 📊 **Advanced Health Monitoring**
- Real-time AI health monitoring with MediaPipe
- Hand gesture recognition and tremor detection
- Posture analysis and monitoring
- Heart rate estimation from facial analysis
- Eye tracking and attention monitoring
- Medication reminder system
- Health metrics tracking with AI insights
- Privacy-first local processing (no data sent to servers)

### 🎤 **Voice Features**
- Speech-to-text input for hands-free operation
- Text-to-speech output with elderly-friendly settings
- Browser-native Web Speech API integration
- No external dependencies

## 🚀 Quick Start

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd caresight
npm install
```

2. **Set up environment (optional):**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys (see DEPLOYMENT.md)
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open in browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Project Status

### ✅ **Completed Features**
- [x] **Advanced AI Health Monitoring** with MediaPipe integration
  - Hand gesture recognition and tremor detection
  - Posture analysis and real-time feedback
  - Heart rate estimation from facial analysis
  - Eye tracking and attention monitoring
- [x] **Enhanced Document Scanner** with Tesseract.js OCR
  - Real-time medical document processing
  - Smart classification (prescriptions, lab reports, medical notes)
  - Medication and dosage extraction
  - Doctor name and patient information detection
- [x] AI chat with Google Gemini integration
- [x] Text-to-speech with elderly-friendly settings
- [x] Speech-to-text for voice input
- [x] EmailJS caregiver alerts with dual alert types
- [x] Care Mode with accessibility features
- [x] 3D heart model visualization
- [x] Comprehensive demo page
- [x] Production-ready fallbacks

### 🔄 **Optional Enhancements**
- [ ] Real SMS integration with Twilio
- [ ] User authentication system
- [ ] Database integration for data persistence
- [ ] Advanced health device integrations
- [ ] Multi-language support

## 🛠️ Technology Stack

- **Framework:** Next.js 14 with TypeScript
- **UI:** Tailwind CSS with Framer Motion
- **AI:** Google Generative AI (Gemini) + MediaPipe AI Models
- **OCR:** Tesseract.js (client-side processing)
- **Health Monitoring:** MediaPipe (hands, pose, face mesh, holistic)
- **3D:** Three.js with React Three Fiber
- **Speech:** Web Speech API (native browser)
- **Email:** EmailJS integration
- **Accessibility:** WAI-ARIA compliant

## 📁 Project Structure

```
caresight/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chat endpoint
│   │   └── upload/route.ts        # OCR processing
│   ├── components/
│   │   ├── AdvancedHealthMonitoring.tsx # AI health monitoring
│   │   ├── DocumentScanner.tsx     # Enhanced OCR processing
│   │   ├── EmergencyContacts.tsx   # Caregiver alerts
│   │   ├── HealthMonitoring.tsx    # Medication & metrics
│   │   ├── ThreeScene.tsx          # 3D heart model
│   │   └── ...
│   ├── context/
│   │   └── CareModeContext.tsx    # Accessibility state
│   ├── chat/page.tsx              # AI assistant
│   ├── upload/page.tsx            # Document scanner
│   ├── demo/page.tsx              # Feature showcase
│   └── dashboard/page.tsx         # Health overview
├── public/
│   └── heart.glb                  # 3D heart model
├── .env.example                   # Environment template
└── DEPLOYMENT.md                  # Production guide
```

## 🎨 Demo

Visit the `/demo` page for an interactive showcase of all features:
- Document scanning simulation
- AI chat examples
- Care mode demonstration
- Emergency alert system
- Voice interaction samples

## 🔐 Environment Setup

Required environment variables (all optional with fallbacks):

```env
# AI API (Optional - fallback responses available)
GEMINI_API_KEY=your_gemini_api_key

# EmailJS (Optional - demo mode available)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id
```

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Other Platforms
See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- Netlify deployment
- Traditional hosting
- Twilio SMS integration
- Production optimization

## ♿ Accessibility Features

CareSight is designed with accessibility as a core principle:

- **Visual:** High contrast mode, large text, clear navigation
- **Motor:** Large touch targets, simple interactions
- **Cognitive:** Simplified language, patient voice synthesis
- **Auditory:** Visual indicators, text alternatives for audio

## 🏥 Healthcare Compliance

- **Privacy:** Client-side OCR processing, no data retention
- **Accuracy:** Educational information only, provider consultation encouraged
- **Accessibility:** WCAG 2.1 AA compliant design
- **Security:** HTTPS required, secure API handling

## 🤝 Contributing

This project was developed for hackathon purposes and is ready for production deployment. See `DEPLOYMENT.md` for setup instructions.

## 📄 License

This project is built for healthcare accessibility and is available for educational and production use.

---

**CareSight** - Making healthcare accessible for everyone! 🏥❤️

*Built with ❤️ for elderly, disabled, and neurodiverse users*
