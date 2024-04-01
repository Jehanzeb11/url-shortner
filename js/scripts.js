const swup = new Swup({
  animateHistoryBrowsing: false,
});

const navbar = document.querySelectorAll(".navbar")[0];
const navs = navbar.querySelectorAll("a");
const burger = document.querySelectorAll(".navbar-burger")[0];
const menu = document.querySelectorAll(".navbar-menu")[0];

burger.onclick = (e) => {
  burger.classList.toggle("is-active");
  menu.classList.toggle("is-active");
};

for (var i = 0; i < navs.length; i++) {
  if (!navs[i].classList.contains("navbar-burger")) {
    navs[i].onclick = () => {
      if (burger.classList.contains("is-active")) {
        burger.classList.toggle("is-active");
        menu.classList.toggle("is-active");
      }
    };
  }
}

const send_data = async (data) => {
  const result_container = document.getElementById("result_container");
  const qrCode = document.getElementById("qrCode");

  const Url = document.getElementById("url").value;
  const response = await fetch(
    `https://tinyurl.com/api-create.php?url=${encodeURIComponent(Url)}`
  );

  if (response.ok) {
    const data = await response.text();
    console.log(data);
    result_container.classList.remove("is-hidden");
    document.getElementById(
      "result"
    ).innerHTML = `shortend URL : <a href="${data}" target="_blank" class="has-text-white has-text-weight-light"> ${data}</a>`;

    const qr = await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${Url}`
    );
    const img = qr.url;

    qrCode.src = img;
  } else {
    document.getElementById("result").innerHTML = "Error shortening";
  }
};

const arm_url_form = () => {
  const url_form = document.getElementById("url_form");
  if (url_form) {
    url_form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      const url_input = url_form.querySelector('input[name="url"]');
      url_form.submit.classList.add("is-loading");
      url_input.disabled = true;
      const data = new FormData();
      data.append("url", url_input.value);

      // Call send_data function to handle form submission asynchronously
      send_data(data)
        .then((res) => {
          console.log(res);
          setTimeout(function () {
            url_form.submit.classList.remove("is-loading");
            url_input.disabled = false;
          }, 1000);
        })
        .catch((error) => {
          console.error("Error:", error);
          url_input.disabled = false;
        });
    });
  } else {
    console.error("Form element not found");
  }
};

const arm_main_tabs = () => {
  const main_tabs = document.querySelectorAll(".tabs.main a");
  const tab_containers = document.querySelectorAll(".tab_container");

  if (main_tabs) {
    for (var i = 0; i < main_tabs.length; i++) {
      main_tabs[i].addEventListener("click", function (e) {
        for (var i = 0; i < main_tabs.length; i++) {
          main_tabs[i].parentNode.classList.remove("is-active");
        }

        for (var i = 0; i < tab_containers.length; i++) {
          tab_containers[i].classList.add("is-hidden");
        }

        let target_div = document.getElementById(
          e.target.getAttribute("data-id")
        );
        target_div.classList.add("animate__fadeIn");
        target_div.classList.remove("is-hidden");

        e.target.parentNode.classList.add("is-active");
      });
    }
  }
};

swup.on("contentReplaced", () => {
  arm_url_form();
  arm_main_tabs();
});

document.addEventListener("swup:animationOutStart", (e) => {
  //window.scrollTo(0, 0);
  arm_url_form();
});

document.addEventListener("DOMContentLoaded", function (e) {
  console.log("DOM LOADED");
  window.scrollTo(0, 0);
  arm_url_form();
  arm_main_tabs();
});

(function () {
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  window.requestAnimationFrame = requestAnimationFrame;
})();

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
  bgCtx = background.getContext("2d"),
  width = window.innerWidth,
  height = document.body.offsetHeight;

height < 400 ? (height = 400) : height;

background.width = width;
background.height = height;

class Terrain {
  constructor(options) {
    options = options || {};
    this.terrain = document.createElement("canvas");
    this.terCtx = this.terrain.getContext("2d");
    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();

    this.terrain.width = width;
    this.terrain.height = height;
    this.fillStyle = options.fillStyle || "#191D4C";
    this.mHeight = options.mHeight || height;

    // generate
    this.points = [];

    var displacement = options.displacement || 140,
      power = Math.pow(2, Math.ceil(Math.log(width) / Math.log(2)));

    // set the start height and end height for the terrain
    this.points[0] = this.mHeight; //(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
    this.points[power] = this.points[0];

    // create the rest of the points
    for (var i = 1; i < power; i *= 2) {
      for (var j = power / i / 2; j < power; j += power / i) {
        this.points[j] =
          (this.points[j - power / i / 2] + this.points[j + power / i / 2]) /
            2 +
          Math.floor(Math.random() * -displacement + displacement);
      }
      displacement *= 0.6;
    }

    document.body.appendChild(this.terrain);
  }
  update() {
    // draw the terrain
    this.terCtx.clearRect(0, 0, width, height);
    this.terCtx.fillStyle = this.fillStyle;

    if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
      this.lastScroll = new Date().getTime();
      this.points.push(this.points.shift());
    }

    this.terCtx.beginPath();
    for (var i = 0; i <= width; i++) {
      if (i === 0) {
        this.terCtx.moveTo(0, this.points[0]);
      } else if (this.points[i] !== undefined) {
        this.terCtx.lineTo(i, this.points[i]);
      }
    }

    this.terCtx.lineTo(width, this.terrain.height);
    this.terCtx.lineTo(0, this.terrain.height);
    this.terCtx.lineTo(0, this.points[0]);
    this.terCtx.fill();
  }
}

// Second canvas used for the stars
bgCtx.fillStyle = "#05004c";
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
  this.size = Math.random() * 2;
  this.speed = Math.random() * 0.05;
  this.x = options.x;
  this.y = options.y;
}

Star.prototype.reset = function () {
  this.size = Math.random() * 2;
  this.speed = Math.random() * 0.05;
  this.x = width;
  this.y = Math.random() * height;
};

Star.prototype.update = function () {
  this.x -= this.speed;
  if (this.x < 0) {
    this.reset();
  } else {
    bgCtx.fillRect(this.x, this.y, this.size, this.size);
  }
};

function ShootingStar() {
  this.reset();
}

ShootingStar.prototype.reset = function () {
  this.x = Math.random() * width;
  this.y = 0;
  this.len = Math.random() * 80 + 10;
  this.speed = Math.random() * 10 + 6;
  this.size = Math.random() * 1 + 0.1;
  // this is used so the shooting stars arent constant
  this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
  this.active = false;
};

ShootingStar.prototype.update = function () {
  if (this.active) {
    this.x -= this.speed;
    this.y += this.speed;
    if (this.x < 0 || this.y >= height) {
      this.reset();
    } else {
      bgCtx.lineWidth = this.size;
      bgCtx.beginPath();
      bgCtx.moveTo(this.x, this.y);
      bgCtx.lineTo(this.x + this.len, this.y - this.len);
      bgCtx.stroke();
    }
  } else {
    if (this.waitTime < new Date().getTime()) {
      this.active = true;
    }
  }
};

var entities = [];

// init the stars
for (var i = 0; i < height; i++) {
  entities.push(
    new Star({
      x: Math.random() * width,
      y: Math.random() * height,
    })
  );
}

// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());
entities.push(new Terrain({ mHeight: height / 2 - 120 }));
entities.push(
  new Terrain({
    displacement: 120,
    scrollDelay: 50,
    fillStyle: "rgb(17,20,40)",
    mHeight: height / 2 - 60,
  })
);
entities.push(
  new Terrain({
    displacement: 100,
    scrollDelay: 20,
    fillStyle: "rgb(10,10,5)",
    mHeight: height / 2,
  })
);

//animate background
function animate() {
  bgCtx.fillStyle = "#110E19";
  bgCtx.fillRect(0, 0, width, height);
  bgCtx.fillStyle = "#ffffff";
  bgCtx.strokeStyle = "#ffffff";

  var entLen = entities.length;

  while (entLen--) {
    entities[entLen].update();
  }
  requestAnimationFrame(animate);
}
animate();
