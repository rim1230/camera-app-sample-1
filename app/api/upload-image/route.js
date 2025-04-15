import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 画像を保存するディレクトリ
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    const filePath = path.join(uploadDir, fileName);
    
    // ファイルを保存
    fs.writeFileSync(filePath, buffer);
    
    // 画像のURLを生成
    const imageUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      imageUrl,
      message: '画像が正常にアップロードされました'
    });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json(
      { error: '画像のアップロード中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}