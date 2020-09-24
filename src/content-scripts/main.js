(function() {
  window.addEventListener("load", async () => {
    const serviceList = await query("[data-testid=awsc-nav-service-menu]")
      .then(el => query(el, "[data-testid=awsc-nav-service-list]"))
      .then(el => queryAll(el, "div > ol > li"));

    const selectedFavorites = Array.from(serviceList)
      .filter(el => {
        return (
          el.querySelector("button svg path").getAttribute("fill") !== "none"
        );
      })
      .map(el => {
        return {
          el,
          displayName: el.querySelector("a").textContent
        };
      });

    const favDiv = selectedFavorites.reduce((acc, fav) => {
      const span = document.createElement("span");
      span.innerText = fav.displayName;
      span.classList.add("fav-item");
      span.addEventListener("click", () => {
        window.location.href = fav.el.querySelector("a").href;
      });
      acc.appendChild(span);
      return acc;
    }, document.createElement("div"));
    favDiv.classList.add("dp-fav-container");

    document.body.appendChild(favDiv);
  });

  async function query(el, selector, attempts = 0) {
    const MAX_TRIES = 5;
    if (typeof el === "string") {
      selector = el;
      el = document;
    }

    const res = el.querySelector(selector);
    if (!res || attempts >= MAX_TRIES) {
      await sleep(300);
      return query(el, selector, ++attempts);
    }

    return res;
  }

  async function queryAll(el, selector, attempts = 0) {
    const MAX_TRIES = 5;
    if (typeof el === "string") {
      selector = el;
      el = document;
    }

    const res = el.querySelectorAll(selector);
    if (!res.length || attempts >= MAX_TRIES) {
      await sleep(300);
      return queryAll(el, selector, ++attempts);
    }

    return res;
  }

  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
})();
