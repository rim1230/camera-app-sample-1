'use client';

import { useRef, useState, useEffect } from 'react';

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  // カメラストリームの開始
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (err) {
        console.error('カメラエラー:', err);
        setError('カメラへのアクセスに失敗しました');
      }
    };

    startCamera();

    // クリーンアップ
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // 画像のキャプチャ
  const captureImage = () => {
    if (!videoRef.current || !isStreaming) return;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // 画像をJPEG形式で取得
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    onCapture(imageDataUrl);
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="w-full h-auto"
        />
      </div>
      
      <button
        onClick={captureImage}
        disabled={!isStreaming}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        写真を撮影
      </button>
    </div>
  );
};

export default Camera;