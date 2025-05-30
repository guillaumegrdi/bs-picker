const submitButton = document.getElementById("submitButton");
const tagInput = document.getElementById("tagInput");
const spinner = document.getElementById("spinner");
const discoverSubmit = document.getElementById("discoverSubmit");
const cardContainer = document.getElementById("cardContainer");
const homeLi = document.getElementById("homeLi");
const statsLi = document.getElementById("statsLi");
const draftLi = document.getElementById("draftLi");
const logoutButton = document.getElementById("logoutButton");
const checkContainer = document.getElementById("checkContainer");
const unValidLogoutButton = document.getElementById("unValidLogout");
const validLogoutButton = document.getElementById("validLogout");

if (cardContainer) {
  cardContainer.addEventListener("mousemove", (e) => {
    const { width, height, left, top } = cardContainer.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = (y / height - 0.5) * -30;
    const rotateY = (x / width - 0.5) * 30;

    cardContainer.children[0].style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    cardContainer.children[0].style.boxShadow = `${-rotateY * 1.5}px ${
      rotateX * 1.5
    }px 15px grey`;
  });

  cardContainer.addEventListener("mouseleave", () => {
    cardContainer.children[0].style.transition = "150ms";
    cardContainer.children[0].style.transform = "rotateX(0) rotateY(0)";
    cardContainer.children[0].style.boxShadow = `0 0 0 0`;
  });
}

if (tagInput) {
  tagInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitButton.click();
    }
  });
}

if (submitButton) {
  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const tag = tagInput.value;
    if (tag.trim() !== "") {
      spinner.style.display = "inline-block";
    } else {
      logoutContainer.children[0].innerHTML = "Enter a valid tag to continue";
      logoutContainer.style.animation = "slide 4s";
      setTimeout(() => {
        logoutContainer.style.animation = "";
      }, 4000);
    }

    try {
      const response = await fetch("http://localhost:3000/api/player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag }),
      });

      const result = await response.json();
      console.log(result);

      localStorage.setItem("playerName", result.data.name);
      window.location.href = "homepage.html";
    } catch (error) {
      console.error("Erreur:", error);
    }
  });
}

if (discoverSubmit) {
  discoverSubmit.addEventListener("click", () => {
    homeLi.style.animation = "sparkle 2s";
    statsLi.style.animation = "sparkle 2s";
    draftLi.style.animation = "sparkle 2s";
    setTimeout(() => {
      homeLi.style.animation = "";
      statsLi.style.animation = "";
      draftLi.style.animation = "";
    }, 2000);
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    checkContainer.style.visibility = "visible";
    unValidLogoutButton.addEventListener("click", () => {
      checkContainer.style.visibility = "hidden";
    });
    validLogoutButton.addEventListener("click", () => {
      localStorage.setItem("justLoggedOut", "true");
      window.location.replace("/frontend/index.html");
    });
  });
}

// index.js
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("justLoggedOut") === "true") {
    const logoutContainer = document.getElementById("logoutContainer");
    console.log("logoutContainer =", logoutContainer);
    if (logoutContainer) {
      logoutContainer.children[0].innerHTML =
        "You have been succesfully logout";
      logoutContainer.style.animation = "slide 4s";
      setTimeout(() => {
        logoutContainer.style.animation = "";
      }, 4000);
    }
    localStorage.removeItem("justLoggedOut");
  }
});
