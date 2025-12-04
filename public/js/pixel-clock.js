function updatePixelClock() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourDeg = (h + m / 60) * 30;      // 360 / 12
  const minuteDeg = (m + s / 60) * 6;     // 360 / 60
  const secondDeg = s * 6;                // 360 / 60

  const hourHand = document.querySelector(".clock-hand-hour");
  const minuteHand = document.querySelector(".clock-hand-minute");
  const secondHand = document.querySelector(".clock-hand-second");

  if (hourHand) {
    hourHand.style.transform = `translate(-50%, -90%) rotate(${hourDeg}deg)`;
  }
  if (minuteHand) {
    minuteHand.style.transform = `translate(-50%, -90%) rotate(${minuteDeg}deg)`;
  }
  if (secondHand) {
    secondHand.style.transform = `translate(-50%, -90%) rotate(${secondDeg}deg)`;
  }
}

updatePixelClock();
setInterval(updatePixelClock, 1000);
