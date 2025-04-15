'use client';

import { useState, useEffect } from 'react';
import Camera from '../components/Camera';

export default function Home() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  // 画像一覧を取得
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/list-images');
      const data = await response.json();
      
      if (data.success) {
        setImages(data.images);
      }
    } catch (err) {
      console.error('画像一覧取得エラー:', err);
    }
  };

  // コンポーネントマウント時に画像一覧を取得
  useEffect(() => {
    fetchImages();
  }, []);

  // 画像キャプチャ時の処理
  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
  };

  // 画像アップロード処理
  const handleUpload = async () => {
    if (!capturedImage) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Base64形式の画像データをBlobに変換
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // FormDataを作成
      const formData = new FormData();
      formData.append('image', blob, 'captured-image.jpg');
      
      // APIにアップロード
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const result = await uploadResponse.json();
      
      if (result.success) {
        // 成功したらキャプチャした画像をクリアして一覧を更新
        setCapturedImage(null);
        fetchImages();
      } else {
        setError(result.error || 'アップロードに失敗しました');
      }
    } catch (err) {
      console.error('アップロードエラー:', err);
      setError('アップロード中にエラーが発生しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カメラ画像保存アプリ</h1>
      
      <div className="mb-6">
        <Camera onCapture={handleCapture} />
      </div>
      
      {capturedImage && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl mb-2">プレビュー</h2>
          <img 
            src={capturedImage} 
            alt="撮影プレビュー"
            className="max-w-full h-auto mb-2" 
          />
          
          <button 
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {uploading ? 'アップロード中...' : '保存する'}
          </button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      <div>
        <h2 className="text-xl mb-2">保存した画像</h2>
        
        {images.length === 0 ? (
          <p>保存された画像はありません</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.name} className="border rounded p-2">
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="w-full h-auto object-cover"  
                />
                <p className="text-xs mt-1">
                  {new Date(image.uploadedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}