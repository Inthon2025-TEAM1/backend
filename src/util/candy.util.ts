export function getRandomCandy() {
  // 대부분의 경우 0, 소수의 경우 1~200 사이의 값을 반환하도록 확률 분기
  // 예: 80%는 0, 20%는 1~200 랜덤 (원하는 대로 조절 가능)
  const prob = Math.random();
  if (prob < 0.8) {
    // 80% 확률로 0
    return 0;
  } else {
    // 20% 확률로 1~200 중 랜덤
    return Math.floor(Math.random() * 200) + 1;
  }
}
