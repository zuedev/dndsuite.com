import db from "./db.json" assert { type: "json" };

var state = {};

window.onload = () => {
  [...$all("select")].forEach(select => {
    var dbCollection = db[select.id + "s"];

    for (var item in dbCollection) {
      var option = document.createElement("option");
      option.text = dbCollection[item].name;
      option.value = item;
      select.appendChild(option);
    }

    select.addEventListener("change", () => update());
  });

  window.location.href.match(/#/g) !== null ? update(window.location.href.split("#")[1].split(";")) : update();

  twemoji.parse(document.body);
};

function update(premade) {
  var [vessel, base, primer, catalyst] = [...$all("select")].map(select => select[select.selectedIndex].value);

  if (premade) {
    [vessel, base, primer, catalyst] = premade;

    $("#vessel").value = vessel;
    $("#base").value = base;
    $("#primer").value = primer;
    $("#catalyst").value = catalyst;
  }

  var result = $("#result");

  result.innerHTML = "";
  result.style = null;

  if (vessel === "none" || base === "none" || primer === "none" || catalyst === "none") {
    var resultMissing = document.createElement("p");
    resultMissing.appendChild(
      document.createTextNode("You're missing: " + Array.from([...$all("select")], (select) => { if (select[select.selectedIndex].value === "none") return select.id; }).filter(n => n).join(", "))
    );
    resultMissing.style.fontWeight = "bold";
    resultMissing.style.margin = 0;

    result.appendChild(resultMissing);
    result.style.background = "darkred";

    if (state.crafted === 1) {
      new Audio('assets/ouh.mp3').play();
      state.crafted = 0;
    }
  } else {
    var resultTitle = document.createElement("h3");
    resultTitle.style.margin = 0;
    resultTitle.innerHTML = `${db.bases[base].effect} ${db.catalysts[catalyst].effect} ${db.vessels[vessel].effect} of ${db.primers[primer].effect}`;

    var resultText = document.createElement("p");
    resultText.innerHTML = db.primers[primer].effectText;
    resultText.style.marginBottom = 0;

    result.appendChild(resultTitle);
    result.appendChild(resultText);
    result.style.background = db.primers[primer].colourBackground;
    result.style.border = `solid 5px ${db.vessels[vessel].borderColour}`;

    [resultTitle, resultText].forEach(element => {
      element.style.color = db.primers[primer].colourText;
    });

    switch (vessel) {
      case "glass_vial":
        new Audio('assets/potion_drinking.mp3').play();
        break;
      case "bomb":
        new Audio('assets/bomb_explosion.mp3').play();
        break;
      default:
        new Audio('assets/potion_craft.mp3').play();
        break;
    }
    state.crafted = 1;
  }

  // TODO: below is gross, please fix

  if (vessel !== "none")
    $("#vessel-description").innerHTML = db.vessels[vessel].description;

  if (base !== "none")
    $("#base-description").innerHTML = db.bases[base].description;

  if (primer !== "none")
    $("#primer-description").innerHTML = db.primers[primer].description;

  if (catalyst !== "none")
    $("#catalyst-description").innerHTML = db.catalysts[catalyst].description;

  if (vessel === "none")
    $("#vessel-description").innerHTML = "";

  if (base === "none")
    $("#base-description").innerHTML = "";

  if (primer === "none")
    $("#primer-description").innerHTML = "";

  if (catalyst === "none")
    $("#catalyst-description").innerHTML = "";

  window.history.pushState("", "", `#${vessel};${base};${primer};${catalyst} `);
}

function $all(query) {
  return document.querySelectorAll(query);
}

function $(query) {
  return document.querySelector(query);
}
