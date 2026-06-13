/**
 * 앱 전역 런타임 설정.
 *
 * USE_MOCK
 * - 개발 모드: EXPO_PUBLIC_USE_MOCK=true → services가 mocks/ 의 mock 데이터를 반환
 * - 개발 및 운영 모드: 미설정/false → 항상 BE API를 호출
 *
 * 기본값을 false로 둬서 운영 빌드에서 mock이 실수로 켜지는 일을 방지한다.
 */
export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
