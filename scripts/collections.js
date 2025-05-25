import { createNavbar } from "../templates/Navbar.js";
import { isLoggedIn } from "./auth.js";
import { reRenderNav, htmlToElement } from "../templates/utils.js";
import {
  editCollectionModalTemplate,
  createCollectionModalTemplate,
  delCollectionModalTemplate,
  createCardModalTemplate,
  editCardModalTemplate,
  deleteCardModal,
} from "../templates/modals.js";
import {
  cardsMainDivCollectionHeader,
  cardsMainDivSearchInput,
} from "../templates/collectionsTemplates.js";
import {
  getAllCollections,
  addCardToCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollection,
  loadSampleCards,
  getCard,
  updateCardCollection,
  deleteCard,
} from "./cardManager.js";
import { createCarousel } from "./carousel.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nav-bar").appendChild(createNavbar());
  refreshCollections();
  intializeModals();
  setUpCollectionsHandlers();
});


function intializeModals() {
  document.body.appendChild(htmlToElement(editCollectionModalTemplate));
  document.body.appendChild(htmlToElement(createCollectionModalTemplate));
  document.body.appendChild(htmlToElement(delCollectionModalTemplate));
  document.body.appendChild(htmlToElement(createCardModalTemplate));
  document.body.appendChild(htmlToElement(editCardModalTemplate));
  document.body.append(htmlToElement(deleteCardModal));
}

function renderCollectionGrid(collections) {
  let cardGrid = document.createElement("div");
  cardGrid.classList.add("card-grid");

  collections.forEach((collection) => {
    const collectionElement = createCollectionElement(collection);
    cardGrid.appendChild(collectionElement);
  });

  document.querySelector(".cards-main-cont").appendChild(cardGrid);
}

function createCollectionElement(collection) {
  const element = document.createElement("div");
  element.className = "collection-card";
  element.dataset.collectionId = collection.id;
  console.log(collection);
  let descriptionText = "";
  descriptionText += collection.cards.map((card) => card.question).join(" ");
  console.log(descriptionText);

  element.innerHTML = `
  <div class="card border-secondary mb-3" style="max-width: 18rem;">
  <div class="card-header bg-transparent border-secondary flex-between">
  <h6 class="collection-title" style="margin-bottom: 0px; font-weight:500;">${
    collection.name
  }</h6>
  <div style="
        display : flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;"
         >
      <button id="edit-collection-btn" class="btn btn-outline-warning"><i class="ph ph-pencil-simple" style="color:inherit;"></i></button>
      <button id="del-collection-btn" class="btn btn-outline-danger"><i class="ph ph-trash" style="color:inherit;"></i></button>
      </div>
  </div>
  <div class="card-body text-success">
    <p class="card-text ellipsis">${
      descriptionText ? descriptionText : "No cards.,"
    }</p>
    <div style="
    font-size: small;
    color: rgba(0, 0, 0, 0.2);
    ">
    <i class="ph ph-cards"></i>
  <span>${
    collection.cards.length == 1
      ? collection.cards.length + " card"
      : collection.cards.length + " cards"
  }</span>
    </div>
  </div>
</div>`;


  element.addEventListener("click", (e) => {
    if (
      e.target.id != "edit-collection-btn" &&
      e.target.id != "del-collection-btn"
    ) {
      openCollection(collection.id);
    }
  });
  return element;
}

function openCollection(collectionId) {
  let cont = document.querySelector(".cards-main-cont");
  cont.innerHTML = "";

  const collection = getCollection(collectionId);
  cont.appendChild(cardsViewHeader(collection.name));
  createCardHandler(collectionId)
  document.getElementById("back-btn").addEventListener("click", () => {
    console.log("clicked")
    refreshCollections();
  });

  if (collection.cards.length === 0) {
    renderEmptyState("cards");
    return;
  }
  
  cont.appendChild(createCarousel(collection));

  let actionCont = document.createElement("div");
  actionCont.classList.add("card-actions-btn-div");
  let [editBtn, deleteBtn] = actionButtons();
  actionCont.appendChild(editBtn);
  actionCont.appendChild(deleteBtn);
  cont.appendChild(actionCont);
  setUpCardsHandlers(collectionId);
}

function setUpCardsHandlers(collectionId) {
  

  createCardHandler(collectionId);

  document.querySelector(".editCardBtn").addEventListener("click", () => {
    const cardIdx = document.querySelector(".custom-card").dataset.index;
    const card = getCard(collectionId, cardIdx);
    console.log(cardIdx, card);
    const modal = new bootstrap.Modal(document.getElementById("editCardModal"));
    document.getElementById("editQuestion").value = card.question;
    document.getElementById("editAnswer").value = card.answer;
    modal.show();
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    const cardIdx = document.querySelector(".custom-card").dataset.index;
    const question = document.getElementById("editQuestion").value;
    const answer = document.getElementById("editAnswer").value;
    if (question && answer) {
      updateCardCollection(collectionId, cardIdx, question, answer);
      openCollection(collectionId);
      bootstrap.Modal.getInstance(
        document.getElementById("editCardModal")
      ).hide();
    } else {
      alert("question and answer can't be empty");
    }
  });

  document.querySelector(".delCardBtn").addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("delCardModal"));
    modal.show();
  });

  document.getElementById("delCardModalBtn").addEventListener("click", () => {
    const cardIdx = document.querySelector(".custom-card").dataset.index;
    deleteCard(collectionId, cardIdx);
    openCollection(collectionId);
    bootstrap.Modal.getInstance(document.getElementById("delCardModal")).hide();
  });
}

function createCardHandler(collectionId) {
  document.getElementById("add-new-card-btn").addEventListener("click", () => {
    const modal = new bootstrap.Modal(
      document.getElementById("createCardModal")
    );
    document.getElementById("question").value = "";
    document.getElementById("answer").value = "";
    modal.show();
  });

  document.getElementById("createCardBtn").addEventListener("click", () => {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer").value.trim();

    console.log(question, answer);
    if (question != null && answer != null) {
      addCardToCollection(collectionId, question, answer);
      openCollection(collectionId);
      bootstrap.Modal.getInstance(
        document.getElementById("createCardModal")
      ).hide();
    } else {
      alert("Please enter the collection title");
    }
  });
}

function setUpCollectionsHandlers() {
  // new collection button to show model
  document
    .querySelector(".new-collection-btn")
    ?.addEventListener("click", () => {
      const modal = new bootstrap.Modal(
        document.getElementById("createCollectionModal")
      );
      document.getElementById("createCollectionNameInput").value = "";
      modal.show();
    });

  // create collection button to close button
  document
    .getElementById("createCollectionBtn")
    .addEventListener("click", () => {
      const name = document
        .getElementById("createCollectionNameInput")
        .value.trim();
      if (name) {
        createCollection(name);
        // refreshCollections();
        bootstrap.Modal.getInstance(
          document.getElementById("createCollectionModal")
        ).hide();
        window.location.href = "/pages/collections.html"
      } else {
        alert("Please enter the collection title");
      }
    });

document.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  if (!button) return;

  if (
    button.id === "edit-collection-btn" ||
    button.id === "del-collection-btn"
  ) {
    e.stopPropagation(); // ✅ Prevents bubbling to card

    const card = button.closest(".collection-card");
    const collectionId = card.getAttribute("data-collection-id");

    if (button.id === "edit-collection-btn") {
      const modal = new bootstrap.Modal(
        document.getElementById("editCollectionModal")
      );
      const currentName = card.querySelector(`.collection-title`).textContent;
      const input = document.getElementById("editCollectionNameInput");

      input.value = currentName;
      document.getElementById("saveCollectionEditBtn").dataset.collectionId =
        collectionId;
      modal.show();
    } else if (button.id === "del-collection-btn") {
      const modal = new bootstrap.Modal(
        document.getElementById("delCollectionModal")
      );
      document.getElementById("delCollectionEditBtn").dataset.collectionId =
        collectionId;
      modal.show();
    }
  }
});

  document
    .getElementById("saveCollectionEditBtn")
    ?.addEventListener("click", () => {
      const newName = document
        .getElementById("editCollectionNameInput")
        .value.trim();
      const collectionId = document.getElementById("saveCollectionEditBtn")
        .dataset.collectionId;

      if (newName && collectionId) {
        updateCollection(newName, collectionId);
        bootstrap.Modal.getInstance(
          document.getElementById("editCollectionModal")
        ).hide();
        refreshCollections();
      }
    });

  document
    .getElementById("delCollectionEditBtn")
    .addEventListener("click", () => {
      const collectionId = document.getElementById("delCollectionEditBtn")
        .dataset.collectionId;
      if (collectionId) {
        deleteCollection(collectionId);
        refreshCollections();
        bootstrap.Modal.getInstance(
          document.getElementById("delCollectionModal")
        ).hide();
      }
    });
}

function refreshCollections() {
  const cont = document.querySelector(".cards-main-cont");
  cont.innerHTML = "";
  // cont.appendChild(htmlToElement(cardsMainDivSearchInput));
  cont.appendChild(htmlToElement(cardsMainDivCollectionHeader));

  const collections = getAllCollections();
  if (!collections || collections.length === 0) {
    renderEmptyState("collections");
  } else {
    renderCollectionGrid(collections);
  }
}

function renderEmptyState(label) {
  let cont = document.createElement("div");
  cont.classList.add("no-collection-cont");
  cont.innerHTML = `<p class="empty-message">
    No ${label} yet. Create one to get started!</p>`;
  document.querySelector(".cards-main-cont").appendChild(cont);
}

function cardsViewHeader(colectionName) {
  let cont = document.createElement("div");
  cont.classList.add("cards-view-header");

  cont.innerHTML = `
  <div class="card-header-title-div">
  <button id="back-btn"><i class="ph ph-arrow-left"></i></button>
  <h3 style="text-align: center;">${colectionName}</h3>
  </div>
  <button id="add-new-card-btn" class="btn btn-primary">New Card</button>`;
  return cont;
}

function actionButtons() {
  let editBtn = document.createElement("button");
  editBtn.classList.add("editCardBtn");
  editBtn.classList.add("btn", "btn-primary");
  editBtn.textContent = "edit";

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delCardBtn");
  deleteBtn.classList.add("btn", "btn-danger");
  deleteBtn.textContent = "delete";

  return [editBtn, deleteBtn];
}
