
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../constants';

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const HantarRakamanSection: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [tarannumType, setTarannumType] = useState('');
  const [ayatText, setAyatText] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<React.ReactNode>('');
  const [isUploadProcessed, setIsUploadProcessed] = useState(false); // Tracks if "Sediakan" button was clicked

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null); // Changed NodeJS.Timeout to number
  const formRef = useRef<HTMLFormElement>(null);


  const resetRecordingState = useCallback(() => {
    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setSecondsRecorded(0);
    audioChunksRef.current = [];
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsUploadProcessed(false);
  }, []);

  const startRecording = async () => {
    if (isRecording) return;
    setSubmissionStatus('');
    resetRecordingState();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstart = () => {
        setIsRecording(true);
        timerIntervalRef.current = setInterval(() => {
          setSecondsRecorded(prev => prev + 1);
        }, 1000) as unknown as number; // Ensure correct type for setInterval
      };

      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        // Do not reset isUploadProcessed here, it should be reset on new recording or submission
      };
      
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setSubmissionStatus(<p className="text-red-500">Gagal mengakses mikrofon. Sila benarkan akses mikrofon.</p>);
      resetRecordingState();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // mediaRecorder.onstop will handle state changes
    }
  };

  const handleProcessUpload = () => {
    if (audioBlob) {
      setSubmissionStatus(<p className="text-blue-500">Memproses rakaman...</p>);
      setIsUploadProcessed(true); // Mark as processed
      setTimeout(() => {
        setSubmissionStatus(<p className="text-green-500">Rakaman sedia untuk dihantar!</p>);
      }, 1000);
    } else {
      setSubmissionStatus(<p className="text-red-500">Tiada rakaman untuk diproses.</p>);
    }
  };

  const handleSendToTelegram = async () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      setSubmissionStatus(<p className="text-red-500">Sila lengkapkan borang nama dan jenis tarannum.</p>);
      formRef.current.reportValidity();
      return;
    }
    if (!audioBlob) {
      setSubmissionStatus(<p className="text-red-500">Tiada rakaman audio untuk dihantar.</p>);
      return;
    }
    if (!isUploadProcessed) {
      setSubmissionStatus(<p className="text-yellow-500">Sila klik "Sediakan Rakaman" dahulu.</p>);
      return;
    }

    setSubmissionStatus(<p className="text-blue-500">Menghantar rakaman...</p>);

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('audio', audioBlob, `rakaman_${studentName.replace(/\s+/g, '_')}_${tarannumType}.wav`);
    let caption = `Rakaman Baru:\nNama: ${studentName}\nJenis Tarannum: ${tarannumType}`;
    if (ayatText.trim()) {
        caption += `\nAyat Dibaca: ${ayatText.trim()}`;
    }
    formData.append('caption', caption);

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendAudio`, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();

        if (result.ok) {
            setSubmissionStatus(<p className="text-green-500 font-semibold mt-2">Rakaman berjaya dihantar ke Telegram!</p>);
            // Reset form and recording state after successful sending
            setStudentName('');
            setTarannumType('');
            setAyatText('');
            if (formRef.current) formRef.current.reset();
            resetRecordingState();
        } else {
            console.error("Telegram API Error:", result);
            setSubmissionStatus(<p className="text-red-500 font-semibold mt-2">Gagal menghantar rakaman: {result.description || 'Ralat tidak diketahui'}.</p>);
        }
    } catch (error) {
        console.error("Error sending to Telegram:", error);
        setSubmissionStatus(<p className="text-red-500 font-semibold mt-2">Gagal menghantar rakaman. Sila semak sambungan internet anda.</p>);
    }
  };

  const handleDeleteRecording = () => {
    resetRecordingState();
    setSubmissionStatus(''); // Clear any previous status messages
  };

  const canProcessUpload = audioBlob && !isRecording;
  const canSendToTelegram = audioBlob && isUploadProcessed && studentName.trim() !== '' && tarannumType.trim() !== '';


  useEffect(() => {
    // Clean up URL object when component unmounts or audioUrl changes
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl]);


  return (
    <section id="hantar-rakaman" className="content-section">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center">
          <i className="fas fa-microphone-alt mr-3 text-accent"></i> HANTAR RAKAMAN ANDA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <form id="recording-form" ref={formRef} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="student-name" className="block text-gray-700 mb-1 font-medium">Nama Anda</label>
                <input type="text" id="student-name" name="student-name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="Cth: Ahmad bin Ali" required />
              </div>
              <div>
                <label htmlFor="tarannum-type" className="block text-gray-700 mb-1 font-medium">Jenis Tarannum</label>
                <select id="tarannum-type" name="tarannum-type" value={tarannumType} onChange={(e) => setTarannumType(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-primary focus:border-primary" required>
                  <option value="">Pilih jenis tarannum</option>
                  <option value="Bayyati">Bayyati</option>
                  <option value="Nahawand">Nahawand</option>
                  <option value="Hijaz">Hijaz</option>
                  <option value="Rast">Rast</option>
                  <option value="Sikah">Sikah</option>
                  <option value="Jiharkah">Jiharkah</option>
                  <option value="Soba">Soba</option>
                </select>
              </div>
              <div>
                <label htmlFor="ayat-text" className="block text-gray-700 mb-1 font-medium">Ayat dan Harakat (Jika Ada)</label>
                <textarea id="ayat-text" name="ayat-text" value={ayatText} onChange={(e) => setAyatText(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 h-28 focus:ring-primary focus:border-primary" placeholder="Tulis ayat dan harakat yang dibaca..."></textarea>
              </div>
            </form>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-light rounded-xl p-6 w-full max-w-md text-center">
              <h3 className="font-bold text-lg text-primary mb-4">Rakam Bacaan Anda</h3>
              <div className="relative mb-5 inline-block">
                <button
                  id="record-button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-24 h-24 rounded-full text-white flex items-center justify-center shadow-lg transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-br from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark'}`}
                  aria-label={isRecording ? "Berhenti Merakam" : "Mula Merakam"}
                >
                  <i id="record-icon" className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} text-3xl`}></i>
                </button>
                {isRecording && (
                  <div id="recording-live-indicator" className="absolute -top-1 -right-1 flex items-center bg-white px-2 py-1 rounded-full shadow">
                    <div className="recording-indicator"></div>
                    <span className="ml-1.5 text-red-600 font-medium text-xs">LIVE</span>
                  </div>
                )}
              </div>
              <div className="mb-5">
                <div id="timer" className="text-2xl font-mono mb-1 text-dark">{formatTime(secondsRecorded)}</div>
                <div className="text-gray-600 text-sm">Tempoh rakaman</div>
              </div>
              <div className="space-y-3">
                {audioUrl && <audio id="audio-playback" controls src={audioUrl} className="w-full rounded-md"></audio>}
                <button
                  id="upload-button" 
                  onClick={handleProcessUpload}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
                  disabled={!canProcessUpload || isUploadProcessed} 
                >
                  <i className="fas fa-cogs mr-2"></i> SEDIAKAN RAKAMAN
                </button>
                {audioBlob && (
                  <button
                    onClick={handleDeleteRecording}
                    className="w-full bg-danger text-white py-3 rounded-lg font-semibold hover:bg-red-700"
                    aria-label="Padam Rakaman Semasa"
                  >
                    <i className="fas fa-trash-alt mr-2"></i> PADAM RAKAMAN
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button
            id="send-to-telegram"
            onClick={handleSendToTelegram}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 md:py-4 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
            disabled={!canSendToTelegram}
          >
            HANTAR KE TELEGRAM <i className="fab fa-telegram-plane ml-2"></i>
          </button>
        </div>
        <div id="submission-status" className="mt-4 text-center min-h-[24px]">{submissionStatus}</div>
      </div>
    </section>
  );
};

export default HantarRakamanSection;