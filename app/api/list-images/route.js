import { NextResponse } from 'next/server';
import { listAll, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';

export async function GET() {
  try {
    // Firebase Storageのuploadsディレクトリを参照
    const storageRef = ref(storage, 'uploads');

    // ディレクトリ内のすべてのファイルを取得
    const result = await listAll(storageRef);

    // 各ファイルのダウンロードURLを取得
    const images = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url,
          uploadedAt: new Date().toISOString(), // Firebaseではアップロード日時が取得できないため仮の値を設定
        };
      })
    );

    // 新しいものから順に並べ替え（仮のuploadedAtを使用）
    images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error('画像一覧取得エラー:', error);
    return NextResponse.json(
      { error: '画像一覧の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}