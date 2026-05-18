# Pretendard 폰트 등록

이 폴더에 Pretendard `.ttf` 파일을 추가하면 앱 전반에 자동 적용됩니다.

## 1. 폰트 파일 다운로드

https://github.com/orioncactus/pretendard/releases — `Pretendard-1.3.x.zip` → `public/static/` 안의 다음 4개 파일을 이 폴더에 복사:

```
Pretendard-Regular.ttf  (400)
Pretendard-Medium.ttf   (500)
Pretendard-Bold.ttf     (700)
Pretendard-ExtraBold.ttf (800)
```

## 2. 등록 활성화

[`hooks/useAppFonts.ts`](../../hooks/useAppFonts.ts)에서 `FONT_FILES`의 require() 주석을 해제하고 `FONT_ENABLED = true`로 변경.

폰트 파일이 추가되기 전까지는 시스템 폰트(SF Pro / Roboto)로 fallback 동작합니다.
