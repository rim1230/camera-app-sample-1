import { NextResponse } from 'next/server';
import { storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json({ error: '画像ファイルが必要です' }, { status: 400 });
    }
    
    // ファイル情報の取得
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // ファイル名を生成（一意のIDを付与）
    const fileName = `${uuidv4()}_image.jpg`;
    
    // Firebase Storageへの参照を作成
    const storageRef = ref(storage, `uploads/${fileName}`);

    // ファイルをFirebase Storageにアップロード
    await uploadBytes(storageRef, buffer);

    // アップロードしたファイルのダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      imageUrl: downloadURL,
      message: '画像が正常にアップロードされました',
    });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json(
      { error: '画像のアップロード中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}