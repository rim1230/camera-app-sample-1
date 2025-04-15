import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      return NextResponse.json({ images: [] });
    }
    
    // ディレクトリ内のファイル一覧を取得
    const files = fs.readdirSync(uploadDir);
    
    // 画像ファイルのURLリストを作成
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => ({
        name: file,
        url: `/uploads/${file}`,
        uploadedAt: fs.statSync(path.join(uploadDir, file)).mtime
      }))
      // 新しいものから順に並べ替え
      .sort((a, b) => b.uploadedAt - a.uploadedAt);
    
    return NextResponse.json({ 
      success: true, 
      images 
    });
  } catch (error) {
    console.error('画像一覧取得エラー:', error);
    return NextResponse.json(
      { error: '画像一覧の取得中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}