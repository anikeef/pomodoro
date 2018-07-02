class Timer {
  constructor(minutes, seconds, element, up, down) {
    this.minutes = minutes;
    this.seconds = seconds;
    this.element = document.querySelector(element);
    this.up = document.querySelector(up);
    this.down = document.querySelector(down);

    this.updateDisplay(this.minutes, this.seconds);

    this.up.addEventListener("click", function() {
      this.increase();
    }.bind(this));
    this.down.addEventListener("click", function() {
      this.decrease();
    }.bind(this));
  }

  updateDisplay(minutes, seconds) {
    this.element.textContent = Timer.timeString(minutes, seconds);
  }

  increase() {
    if (this.minutes < 100) {
      this.minutes += 1;
      this.updateDisplay(this.minutes, this.seconds);
    }
  }

  decrease() {
    if (this.minutes > 0) {
      this.minutes -= 1;
      this.updateDisplay(this.minutes, this.seconds);
    }
  }

  startTimer() {
    let minutes = this.minutes;
    let seconds = this.seconds;
    this.updateDisplay(minutes, seconds);
    window.intervalId = setInterval(function() {
      if (minutes === 0 && seconds === 0) {
        clearInterval(intervalId)
      } else if (seconds === 0) {
        minutes -= 1;
        seconds = 59;
      } else {
        seconds -= 1;
      }
      this.updateDisplay(minutes, seconds);
    }.bind(this), 1000);
  }

  static timeString(minutes, seconds) {
    return `${Timer.zeroing(minutes)}:${Timer.zeroing(seconds)}`;
  }

  static zeroing(num) {
    if (num.toString().length === 1) {
      return `0${num}`;
    }
    return num.toString();
  }
}

const work = new Timer(25, 0, ".work .time", ".work .up", ".work .down");
const breaking = new Timer(5, 0, ".break .time", ".break .up", ".break .down");

const toggle = document.querySelector('.toggle');
const heading = document.querySelector('h1');
const setupElements = [...Array.from(document.querySelectorAll('h2')),
                        ...Array.from(document.querySelectorAll('.arrow')),
                      ];

toggle.addEventListener("click", function() {
  if (toggle.textContent === "Start") {
    window.stopTimeout = setTimeout(stopTimer,
      (work.minutes + breaking.minutes) * 60000 + (work.seconds + breaking.seconds) * 1000 + 2000)

    heading.textContent = "Working...";
    toggle.textContent = "Stop";

    work.element.classList.add('playing');
    setupElements.forEach(element => element.style.visibility = "hidden");

    work.startTimer();

    window.timeoutId = setTimeout(function() {
      heading.textContent = "Break time!";

      work.element.classList.remove('playing');
      breaking.element.classList.add('breaking');

      breaking.startTimer();
    }, work.minutes * 60000 + work.seconds * 1000 + 1000);
  } else {
    stopTimer();
    clearTimeout(stopTimeout);
  }
})

function stopTimer() {
  heading.textContent = "Pomodoro";
  toggle.textContent = "Start";

  breaking.element.classList.remove('breaking');
  work.element.classList.remove('playing');
  setupElements.forEach(element => element.style.visibility = "visible");

  clearInterval(intervalId);
  clearTimeout(timeoutId);
  work.updateDisplay(work.minutes, work.seconds);
  breaking.updateDisplay(breaking.minutes, breaking.seconds);
}
