class Game {
  checkX = () => {
    if (this.x >= this.gameSpaceCoords.right) {
      // this.jumper.style.left = this.gameSpaceCoords.left + 1 + "px";
      this.x = this.gameSpaceCoords.left;
    } else if (this.x + this.jumper.offsetWidth <= this.gameSpaceCoords.left) {
      // this.jumper.style.left = this.gameSpaceCoords.right - 1 + "px";
      this.x = this.gameSpaceCoords.right - 1;
    }
  };

  onKeyDown(event) {
    if (!this.timer) {
      this.timer = setInterval(this.changeCoords.bind(this), 10);
    }

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      if (!this.keys.includes(event.key)) {
        this.keys.push(event.key);
      }
    }
  }

  onKeyUp(event) {
    const keyIndex = this.keys.indexOf(event.key);
    this.keys.splice(keyIndex, 1);
    if (!this.keys.length) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }

  changeCoords() {
    if (this.end) return;
    if (this.keys.includes("ArrowRight")) {
      this.x += 3;
      this.move();
    }
    if (this.keys.includes("ArrowLeft")) {
      this.x -= 3;
      this.move();
    }
  }

  move() {
    this.checkX();
    this.jumper.style.left = this.x + "px";
  }

  generatePlatforms = () => {
    const checkPlatform = (p) => {
      const pos = p.getBoundingClientRect().top;
      if (pos > document.documentElement.clientHeight) {
        p.remove();
      }
    };

    const checkLastPlatform = (posB, posT, gameSpace) => {
      const pos = document.documentElement.clientHeight - posB;

      const top = posT;

      const createPlatform = (newHeight) => {
        const platform = document.createElement("div");
        let random = [randomPlatform(newHeight)];
        if (
          (random[0] === "flying" || random[0] === "") &&
          Math.random() < 0.07
        ) {
          random.push("hell");
        }
        platform.className = random.concat("platform").join(" ");
        return platform;
      };

      const randomLeft = () => {
        return Math.random() * (gameSpace.offsetWidth - 80);
      };

      const randomPlatform = (newHeight) => {
        const platforms = document.querySelectorAll(".platform");
        let platformT = "";
        const platformsT = ["flying", "broken", "cloud", "danger", "spring"];
        if (platforms.length) {
          if (
            (platforms[0].className.includes("danger") ||
              platforms[0].className.includes("cloud")) &&
            (platforms[1].className.includes("danger") ||
              platforms[1].className.includes("cloud"))
          ) {
            platformsT.splice(platformsT.indexOf("cloud"), 1);
            platformsT.splice(platformsT.indexOf("danger"), 1);
          }
        }

        const c = Math.random();
        if (newHeight > 2000 && c > 0.7) {
          platformT +=
            platformsT[Math.round(Math.random() * (platformsT.length - 1))];
        } else if (newHeight > 5000 && c > 0.6) {
          platformT +=
            platformsT[Math.round(Math.random() * (platformsT.length - 1))];
        } else if (newHeight > 10000 && c > 0.5) {
          platformsT.push("monster");
          platformT +=
            platformsT[Math.round(Math.random() * (platformsT.length - 1))];
        } else if (newHeight > 20000 && c > 0.3) {
          platformsT.push("monster");
          platformT +=
            platformsT[Math.round(Math.random() * (platformsT.length - 1))];
        } else if (newHeight > 30000 && c > 0.2) {
          platformsT.push("monster");
          platformT +=
            platformsT[Math.round(Math.random() * (platformsT.length - 1))];
        } else if (newHeight > 50000 && c > 0.1) {
          platformsT.push("monster");
          platformT +=
            platformsT[Math.round(Math.random() * (platformsT.length - 1))];
        }

        return platformT;
      };

      for (let i = 1; i < Math.floor(top / 110) + 1; i++) {
        const newPlatform = createPlatform(this.newHeight);
        gameSpace.prepend(newPlatform);
        newPlatform.style.left = randomLeft() + "px";
        newPlatform.style.bottom =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight +
          pos +
          10 +
          i * 110 +
          "px";
      }
    };

    const platforms = document.querySelectorAll(".platform");

    if (!platforms.length) {
      checkLastPlatform(754, 754, this.gameSpace);
      return;
    }

    for (let platform of platforms) {
      checkPlatform(platform);
    }

    checkLastPlatform(
      platforms[0].getBoundingClientRect().bottom,
      platforms[0].getBoundingClientRect().top,
      this.gameSpace
    );
  };

  jumpUp = (jumpHeight = this.jumpHeight, q = true) => {
    const setCounter = (h, counter) => {
      const prev = counter.textContent;
      const newC = Math.abs(Math.round(h));
      if (newC > prev) {
        counter.textContent = newC;
      }
    };

    const checkMonster = (y) => {
      const elem1 = document.elementFromPoint(
        this.jumper.getBoundingClientRect().left + 1,
        y
      );
      const elem2 = document.elementFromPoint(
        this.jumper.getBoundingClientRect().left + this.jumper.offsetWidth / 2,
        y
      );
      const elem3 = document.elementFromPoint(
        this.jumper.getBoundingClientRect().right,
        y
      );
      if (!elem1 && !elem2 && !elem3) return false;
      let isMonster = true;
      if (elem1) {
        isMonster = isMonster && !elem1.className.includes("monster");
      }
      if (elem2) {
        isMonster = isMonster && !elem2.className.includes("monster");
      }
      if (elem3) {
        isMonster = isMonster && !elem3.className.includes("monster");
      }
      return !isMonster;
    };

    let x = jumpHeight;
    let prev = Math.pow(jumpHeight, 2);
    const jumperXNew = this.jumper.getBoundingClientRect().top;
    const timer = setInterval(
      () => {
        if (this.end) {
          return clearInterval(timer);
        }
        const s = jumperXNew - Math.pow(jumpHeight, 2) + Math.pow(x, 2);

        if (s > this.quarter) {
          if (q && checkMonster(s)) {
            this.jumper.remove();
            // return setTimeout(() => {
            this.endGame();
            // }, 1000);
            return;
          }
          this.jumper.style.top = s + "px";
        } else {
          if (q && checkMonster(this.quarter)) {
            this.jumper.remove();
            // return setTimeout(() => {
            this.endGame();
            // }, 1000);
            return;
          }
          this.newHeight =
            parseFloat(document.body.style.height) - Math.pow(x, 2) + prev;
          document.body.style.height = this.newHeight + "px";
          this.generatePlatforms();
        }
        setCounter(
          // this.jumper.getBoundingClientRect().bottom -
          //   document.documentElement.clientHeight +
          //   document.documentElement.scrollHeight -
          //   document.documentElement.clientHeight,
          this.newHeight,
          this.counter
        );

        if (x === 0) {
          clearInterval(timer);
          return this.jumpDown(this.endGame);
        }
        prev = Math.pow(x, 2);
        x = Math.round(x * 100 - 20) / 100;
      },
      8,
      []
    );
  };

  jumpDown = () => {
    const checkJump = (jumper, endGame) => {
      const bottom = jumper.getBoundingClientRect().bottom;
      const left = jumper.getBoundingClientRect().left;
      const right = jumper.getBoundingClientRect().right;

      const elem1 = document.elementFromPoint(left + 1, bottom);
      const elem2 = document.elementFromPoint(right - 1, bottom);
      const elem3 = document.elementFromPoint(
        left + jumper.offsetWidth / 2,
        bottom
      );

      if (!elem1 && !elem2 && !elem3) {
        return endGame();
      }

      return elem1 && elem1.className.includes("platform")
        ? elem1
        : elem2 && elem2.className.includes("platform")
        ? elem2
        : elem3 && elem3.className.includes("platform")
        ? elem3
        : null;
    };

    const platformAction = (platform, jumper, jumpUp, jumpHeight, endGame) => {
      let jump = jumpHeight;
      let q = true;
      if (platform.className.includes("danger")) {
        clearInterval(timer);
        jumper.remove();
        setTimeout(() => {
          endGame();
        }, 1000);
        return;
      } else if (platform.className.includes("cloud")) {
        return;
      } else if (
        platform.className.includes("broken") ||
        platform.className.includes("monster")
      ) {
        clearInterval(timer);
        jumper.style.top =
          platform.getBoundingClientRect().top - jumper.offsetHeight + "px";
        platform.remove();

        return jumpUp();
      } else if (platform.className.includes("spring")) {
        jump = jumpHeight * 2;
        q = false;
      } else if (platform.className.includes("hell")) {
        jump = jumpHeight * 4;
        q = false;
      }
      clearInterval(timer);
      jumper.style.top =
        platform.getBoundingClientRect().top - jumper.offsetHeight + "px";
      return jumpUp(jump, q);
    };
    let x = 0;
    const jumperNew = parseFloat(this.jumper.style.top);
    const timer = setInterval(() => {
      const elem = checkJump(this.jumper, this.endGame);
      if (this.end) {
        return clearInterval(timer);
      }
      if (elem) {
        platformAction(
          elem,
          this.jumper,
          this.jumpUp,
          this.jumpHeight,
          this.endGame
        );
      }
      this.jumper.style.top = jumperNew + Math.pow(x, 2) + "px";
      x = Math.round(x * 100 - 20) / 100;
    }, 8);
  };

  endGame = () => {
    const createModal = (startGame) => {
      const modal = document.createElement("div");
      modal.className = "end-modal";
      modal.innerHTML = `
        <h1>YOU LOSE</h1>
      `;
      const btn = document.createElement("button");
      btn.onclick = startGame;
      btn.textContent = "TRY AGAIN";
      modal.append(btn);

      return modal;
    };

    this.jumper.remove();
    this.jumper = null;

    this.jumperCoords = null;

    this.gameSpace.remove();
    this.gameSpace = null;
    this.gameSpaceCoords = null;

    this.counter.textContent = "";
    this.counter.remove();
    this.counter = null;

    this.quarter = 0;
    this.newHeight = 0;
    document.body.style.height = document.documentElement.clientHeight + "px";

    this.x = 0;
    this.keys = [];

    this.end = true;

    clearInterval(this.timer);

    this.listener1();
    this.listener2();

    document.body.append(createModal(this.startGame));
  };

  customListener(target, type, func) {
    target.addEventListener(type, func);
    return () => {
      target.removeEventListener(type, func);
    };
  }

  startGame = () => {
    const createJumper = () => {
      const result = document.createElement("div");
      result.id = "jumper";
      return result;
    };

    const createGameSpace = () => {
      const result = document.createElement("div");
      result.className = "game-space";
      return result;
    };

    const createCounter = () => {
      const result = document.createElement("div");
      result.className = "counter";
      return result;
    };

    const startModal = document.querySelector(".start-modal");
    const endModal = document.querySelector(".end-modal");
    if (startModal) {
      startModal.remove();
    } else {
      endModal.remove();
    }

    this.jumper = createJumper();

    document.body.prepend(this.jumper);

    this.jumperCoords = jumper;

    this.gameSpace = createGameSpace();

    const black = document.querySelector(".black");
    black.insertAdjacentElement("afterend", this.gameSpace);

    this.gameSpaceCoords = this.gameSpace.getBoundingClientRect();

    this.counter = createCounter();

    document.body.append(this.counter);

    this.quarter = document.documentElement.clientHeight / 2.5;
    this.newHeight = 0;

    this.timer = null;
    this.keys = [];

    this.x = this.jumper.getBoundingClientRect().left;
    this.listener1 = this.customListener(
      document,
      "keydown",
      this.onKeyDown.bind(this)
    );
    this.listener2 = this.customListener(
      document,
      "keyup",
      this.onKeyUp.bind(this)
    );

    this.generatePlatforms();

    this.end = false;

    this.jumpUp();
  };

  constructor(jh) {
    this.jumpHeight = jh;
  }
}

const game = new Game(19.2);

const start = game.startGame;
