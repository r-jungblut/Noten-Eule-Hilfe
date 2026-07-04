let sections = [];
let tocLinks = [];

window.onload = () => {
    // TOC generieren
    generiereTOC();

    sections = Array.from(document.querySelectorAll("main section[id]"));
    tocLinks = Array.from(document.querySelectorAll(".toc a"));

    document
        .getElementById("content")
        .addEventListener("scroll", aktualisiereAktivenAbschnitt);
};

// ----- Dynamische TOC -----
function generiereTOC() {
    const tocContainer = document.querySelector(".toc");
    tocContainer.innerHTML = ""; // leeren

    const topSections = Array.from(document.querySelectorAll("main > section[id]"));
    const ulTop = document.createElement("ul");

    topSections.forEach(sec => {
        const liTop = document.createElement("li");
        const aTop = document.createElement("a");
        aTop.href = "#" + sec.id;
        aTop.textContent = sec.querySelector("h2").textContent;
        liTop.appendChild(aTop);

        const subSections = Array.from(sec.querySelectorAll(":scope > section[id]"));
        if (subSections.length > 0) {
            const ulSub = document.createElement("ul");
            subSections.forEach(sub => {
                const liSub = document.createElement("li");
                const aSub = document.createElement("a");
                aSub.href = "#" + sub.id;
                aSub.textContent = sub.querySelector("h3").textContent;
                liSub.appendChild(aSub);
                ulSub.appendChild(liSub);
            });
            liTop.appendChild(ulSub);
        }

        ulTop.appendChild(liTop);
    });

    tocContainer.appendChild(ulTop);
}

// ----- Aktiver Abschnitt + Scroll -----
function aktualisiereAktivenAbschnitt() {
    const content = document.getElementById("content");
    const scrollPos = content.scrollTop + 20;

    let aktuell = sections[0];

    for (const section of sections) {
        if (section.offsetTop <= scrollPos) {
            aktuell = section;
        }
    }

    setzeAktivenTocEintrag(aktuell.id);
}

function setzeAktivenTocEintrag(id) {
    tocLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + id
        );
    });

    const aktiv = tocLinks.find(
        l => l.getAttribute("href") === "#" + id
    );

    if (aktiv) {
        aktiv.scrollIntoView({ block: "nearest" });
    }
}

// ----- Navigation -----
function goHome() {
    document.getElementById("content").scrollTop = 0;
}

function goNext() {
    navigiereRelativ(1);
}

function goPrev() {
    navigiereRelativ(-1);
}

function navigiereRelativ(delta) {
    const content = document.getElementById("content");
    const pos = content.scrollTop + 20;

    const index = sections.findIndex(s => s.offsetTop > pos);

    let ziel;
    if (delta > 0) {
        ziel = sections[index] || sections[sections.length - 1];
    } else {
        ziel = sections[Math.max(index - 2, 0)];
    }

    if (ziel) {
        ziel.scrollIntoView({ behavior: "smooth" });
    }
}

// ----- Suche -----
function suche() {
    const query = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    sections.forEach(section => {
        section.style.display =
            section.innerText.toLowerCase().includes(query)
                ? ""
                : "none";
    });
}
