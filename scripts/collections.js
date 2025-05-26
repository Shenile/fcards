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
} from "../templates/collectionsTemplates.js";
import {
  getAllCollections,
  addCardToCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollection,
  getCard,
  updateCardCollection,
  deleteCard,
} from "./cardManager.js";
import { createCarousel } from "./carousel.js";

let currentCollectionId = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nav-bar").appendChild(createNavbar());
  initializeModals();
  setupEventDelegation();
  refreshCollections();
});

function initializeModals() {
  [
    editCollectionModalTemplate,
    createCollectionModalTemplate,
    delCollectionModalTemplate,
    createCardModalTemplate,
    editCardModalTemplate,
    deleteCardModal,
  ].forEach(template => document.body.appendChild(htmlToElement(template)));
}

function setupEventDelegation() {
  document.querySelector(".new-collection-btn")?.addEventListener("click", () => {
    document.getElementById("createCollectionNameInput").value = "";
    new bootstrap.Modal(document.getElementById("createCollectionModal")).show();
  });
  document.addEventListener("click", (e) => {
    const target = e.target;
    const btn = target.closest("button");
    if (!btn) return;
    
    if (btn.classList.contains("new-collection-btn")) {
    document.getElementById("createCollectionNameInput").value = "";
    new bootstrap.Modal(document.getElementById("createCollectionModal")).show();
    return;
  }


    switch (btn.id) {
      case "edit-collection-btn":
        handleEditCollection(btn);
        break;
      case "del-collection-btn":
        handleDeleteCollection(btn);
        break;
      case "saveCollectionEditBtn":
        saveEditedCollection();
        break;
      case "delCollectionEditBtn":
        confirmDeleteCollection();
        break;
      case "createCollectionBtn":
        console.log("clicked")
        createNewCollection();
        break;
      case "add-new-card-btn":
        openCreateCardModal();
        break;
      case "createCardBtn":
        createCard();
        break;
      case "saveBtn":
        saveEditedCard();
        break;
      case "delCardModalBtn":
        confirmDeleteCard();
        break;
    }

    if (btn.classList.contains("editCardBtn")) {
      openEditCardModal();
    } else if (btn.classList.contains("delCardBtn")) {
      openDeleteCardModal();
    }
  });

  
}

function handleEditCollection(button) {
  const card = button.closest(".collection-card");
  const collectionId = card.dataset.collectionId;
  const currentName = card.querySelector(".collection-title").textContent;
  const input = document.getElementById("editCollectionNameInput");
  input.value = currentName;
  document.getElementById("saveCollectionEditBtn").dataset.collectionId = collectionId;
  new bootstrap.Modal(document.getElementById("editCollectionModal")).show();
}

function handleDeleteCollection(button) {
  const card = button.closest(".collection-card");
  const collectionId = card.dataset.collectionId;
  document.getElementById("delCollectionEditBtn").dataset.collectionId = collectionId;
  new bootstrap.Modal(document.getElementById("delCollectionModal")).show();
}

function saveEditedCollection() {
  const input = document.getElementById("editCollectionNameInput");
  const collectionId = document.getElementById("saveCollectionEditBtn").dataset.collectionId;
  const newName = input.value.trim();
  if (newName) {
    updateCollection(newName, collectionId);
    bootstrap.Modal.getInstance(document.getElementById("editCollectionModal")).hide();
    refreshCollections();
  }
}

function confirmDeleteCollection() {
  const collectionId = document.getElementById("delCollectionEditBtn").dataset.collectionId;
  deleteCollection(collectionId);
  bootstrap.Modal.getInstance(document.getElementById("delCollectionModal")).hide();
  refreshCollections();
}

function createNewCollection() {
  const name = document.getElementById("createCollectionNameInput").value.trim();
  if (name) {
    createCollection(name);
    bootstrap.Modal.getInstance(document.getElementById("createCollectionModal")).hide();
    window.location.href = "/pages/collections.html";
  } else {
    alert("Please enter the collection title");
  }
}

function refreshCollections() {
  const cont = document.querySelector(".cards-main-cont");
  cont.innerHTML = "";
  cont.appendChild(htmlToElement(cardsMainDivCollectionHeader));

  const collections = getAllCollections();
  if (!collections || collections.length === 0) {
    renderEmptyState("collections");
  } else {
    renderCollectionGrid(collections);
  }
}

function renderCollectionGrid(collections) {
  const cardGrid = document.createElement("div");
  cardGrid.classList.add("card-grid");
  collections.forEach((collection) => {
    const element = createCollectionElement(collection);
    cardGrid.appendChild(element);
  });
  document.querySelector(".cards-main-cont").appendChild(cardGrid);
}

function createCollectionElement(collection) {
  const element = document.createElement("div");
  element.className = "collection-card";
  element.dataset.collectionId = collection.id;

  const description = collection.cards.map(card => card.question).join(" ") || "No cards.";

  element.innerHTML = `
    <div class="card mb-3" style="max-width: 18rem; border: 1px solid rgba(0, 0, 0, 0.2);">
      <div class="card-header bg-transparent flex-between" style="
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      background-color:rgba(0, 0, 0, 0.2)">
        <h6 class="collection-title" style="margin-bottom: 0px; font-weight:500;">${collection.name}</h6>
        <div style="display:flex; gap:10px;">
          <button id="edit-collection-btn" class="btn btn-outline-warning"><i class="ph ph-pencil-simple"></i></button>
          <button id="del-collection-btn" class="btn btn-outline-danger"><i class="ph ph-trash"></i></button>
        </div>
      </div>
      <div class="card-body text-success">
        <p class="card-text ellipsis">${description}</p>
        <div style="font-size: small; color: rgba(0, 0, 0, 0.2);">
          <i class="ph ph-cards"></i>
          <span>${collection.cards.length} card${collection.cards.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>`;

  element.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      openCollection(collection.id);
    }
  });

  return element;
}

function openCollection(collectionId) {
  currentCollectionId = collectionId;
  const cont = document.querySelector(".cards-main-cont");
  cont.innerHTML = "";

  const collection = getCollection(collectionId);
  cont.appendChild(cardsViewHeader(collection.name));

  document.getElementById("back-btn").addEventListener("click", refreshCollections);

  if (collection.cards.length === 0) {
    renderEmptyState("cards");
    return;
  }

  cont.appendChild(createCarousel(collection));

  const actionCont = document.createElement("div");
  actionCont.classList.add("card-actions-btn-div");
  const [editBtn, deleteBtn] = actionButtons();
  actionCont.appendChild(editBtn);
  actionCont.appendChild(deleteBtn);
  cont.appendChild(actionCont);
}

function cardsViewHeader(collectionName) {
  const cont = document.createElement("div");
  cont.classList.add("cards-view-header");
  cont.innerHTML = `
    <div class="card-header-title-div">
      <button id="back-btn"><i class="ph ph-arrow-left"></i></button>
      <h3>${collectionName}</h3>
    </div>
    <button id="add-new-card-btn" class="btn btn-primary">New Card</button>`;
  return cont;
}

function openCreateCardModal() {
  document.getElementById("question").value = "";
  document.getElementById("answer").value = "";
  new bootstrap.Modal(document.getElementById("createCardModal")).show();
}

function createCard() {
  const question = document.getElementById("question").value.trim();
  const answer = document.getElementById("answer").value.trim();
  if (question && answer) {
    addCardToCollection(currentCollectionId, question, answer);
    bootstrap.Modal.getInstance(document.getElementById("createCardModal")).hide();
    openCollection(currentCollectionId);
  } else {
    alert("Please fill in both fields");
  }
}

function openEditCardModal() {
  const idx = document.querySelector(".custom-card").dataset.index;
  const card = getCard(currentCollectionId, idx);
  document.getElementById("editQuestion").value = card.question;
  document.getElementById("editAnswer").value = card.answer;
  new bootstrap.Modal(document.getElementById("editCardModal")).show();
}

function saveEditedCard() {
  const idx = document.querySelector(".custom-card").dataset.index;
  const question = document.getElementById("editQuestion").value.trim();
  const answer = document.getElementById("editAnswer").value.trim();
  if (question && answer) {
    updateCardCollection(currentCollectionId, idx, question, answer);
    bootstrap.Modal.getInstance(document.getElementById("editCardModal")).hide();
    openCollection(currentCollectionId);
  } else {
    alert("Question and answer can't be empty");
  }
}

function openDeleteCardModal() {
  new bootstrap.Modal(document.getElementById("delCardModal")).show();
}

function confirmDeleteCard() {
  const idx = document.querySelector(".custom-card").dataset.index;
  deleteCard(currentCollectionId, idx);
  bootstrap.Modal.getInstance(document.getElementById("delCardModal")).hide();
  openCollection(currentCollectionId);
}

function renderEmptyState(label) {
  const cont = document.createElement("div");
  cont.classList.add("no-collection-cont");
  cont.innerHTML = `<p class="empty-message">No ${label} yet. Create one to get started!</p>`;
  document.querySelector(".cards-main-cont").appendChild(cont);
}

function actionButtons() {
  const editBtn = document.createElement("button");
  editBtn.className = "editCardBtn btn btn-primary";
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delCardBtn btn btn-danger";
  deleteBtn.textContent = "Delete";

  return [editBtn, deleteBtn];
}