const world = document.querySelector("#gameBoard");
const c = world.getContext("2d");

world.width = world.clientWidth;
world.height = world.clientHeight;

let frames = 0;

const keys = {
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

class Player {
  constructor() {
    this.width = 32;
    this.height = 32;
    this.velocity = {
      x: 0,
      y: 0,
    };
    const image = new Image();
    image.src = "./spaceship.png";
    image.onload = () => {
      this.image = image;
      this.width = 40;
      this.height = 40;
      this.position = {
        x: world.width / 2 - this.width / 2,
        y: world.height - this.height - 10,
      };
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  shoot() {
    missiles.push(
      new Missile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y,
        },
      })
    );
  }

  update() {
    if (this.image) {
      if (keys.ArrowLeft.pressed && this.position.x >= 0) {
        this.velocity.x = -5;
      } else if (
        keys.ArrowRight.pressed &&
        this.position.x <= world.width - this.width
      ) {
        this.velocity.x = 5;
      } else {
        this.velocity.x = 0;
      }

      this.position.x += this.velocity.x;
      this.draw();
    }
  }
}

class Alien {
  constructor({ position }) {
    this.velocity = { x: 0, y: 0 };
    const image = new Image();
    image.src = "./ghost.png";
    image.onload = () => {
      this.image = image;
      this.width = 35;
      this.height = 35;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update({ velocity }) {
    if (this.image) {
      this.position.x += velocity.x;
      this.position.y += velocity.y;
      if (this.position.y + this.height >= world.height) {
        console.log("you loose bro 👽");
      }
    }
    this.draw();
  }

  shoot(alienMissiles) {
    if (this.position) {
      alienMissiles.push(
        new alienMissiles({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          velocity: {
            x: 0,
            y: 3,
          },
        })
      );
    }
  }
}

class Missile {
  constructor({ position }) {
    this.position = position;
    this.velocity = { x: 0, y: -5 };
    this.width = 3;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.y += this.velocity.y;
    this.draw();
  }
}

class Grid {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0.5, y: 0 };
    this.invaders = [];
    // let rows = Math.floor((world.height / 36) * (1 / 3));
    // const colums = Math.floor((world.width / 36) * (2 / 3));
    this.height = rows * 36;
    this.width = colums * 36;
    for (let x = 0; x < colums; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Alien({
            position: {
              x: x * 36,
              y: y * 36,
            },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;
    if (this.position.x + this.width >= world.width || this.position.x == 0) {
      this.velocity.x = this.velocity.x;
      this.velocity.y = 34;
    }
  }
}

const missiles = [];

let grids = [new Grid()];

const player = new Player();

let particules = [];

const animationLoop = () => {
  c.clearRect(0, 0, world.width, world.height);
  //   console.log(frames);
  player.update();
  requestAnimationFrame(animationLoop);

  missiles.forEach((missile, index) => {
    if (missile.position.y + missile.height <= 0) {
      setTimeout(() => {
        missiles.splice(index, 1);
      }, 0);
    } else {
      missile.update();
    }
  });

  grids.forEach((grid) => {
    grid.update();
    grid.invaders.forEach((invader) => {
      invader.update({ velocity: grid.velocity });
    });
  });

  frames++;
};
animationLoop();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      console.log("gauche");
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      console.log("droite");
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      console.log("gauche");
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      console.log("droite");
      break;
    case " ":
      player.shoot();
      console.log(missiles);
  }
});
