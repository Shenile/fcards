const COLLECTION_KEY = "user_collections";

function getCurrentUser() {
  console.log(JSON.parse(localStorage.getItem("currentUser")));
  return JSON.parse(localStorage.getItem("currentUser"));
}

// Get collections for current user
function getUserCollections() {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const allCollections = JSON.parse(localStorage.getItem(COLLECTION_KEY)) || {};
  return allCollections[currentUser.email] || [];
}

// Save collections for current user
function saveUserCollections(collections) {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const allCollections = JSON.parse(localStorage.getItem(COLLECTION_KEY)) || {};
  allCollections[currentUser.email] = collections;
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(allCollections));
  return true;
}

// Create a new collection
export function createCollection(name) {
  const collections = getUserCollections();
  if (collections === null) return null;

  const newCollection = {
    id: Date.now().toString(),
    name,
    cards: [],
    userId: getCurrentUser().email,
  };

  console.log(newCollection);

  collections.push(newCollection);
  saveUserCollections(collections);
  return newCollection;
}

// Get all collections for current user
export function getAllCollections() {
  return getUserCollections();
}

// Get a specific collection (only if owned by current user)
export function getCollection(id) {
  const collections = getUserCollections();
  console.log(collections);
  console.log(
    collections.find((c) => c.id == id && c.email == getCurrentUser()?.email)
  );
  if (!collections) return null;

  return collections.find(
    (c) => c.id === id && c.userId === getCurrentUser()?.email
  );
}


// get card
export function getCard(
  collectionId,
  cardIndex
) {
  const collections = getUserCollections();
  if (!collections) return null;

  const currentUserEmail = getCurrentUser()?.email;
  if (!currentUserEmail) return null;

  const collection = collections.find(
    (c) => c.id === collectionId && c.userId === currentUserEmail
  );
  if (!collection) return null;
  
  return collection.cards[cardIndex] ? collection.cards[cardIndex] : null;
}
// add card
export function addCardToCollection(collectionId, question, answer) {
  const collections = getUserCollections();
  if (!collections) return null;

  const collection = collections.find(
    (c) => c.id === collectionId && c.userId === getCurrentUser()?.email
  );
  if (!collection) return null;

  const newCard = {
    id: Date.now().toString(),
    question,
    answer,
  };

  collection.cards.push(newCard);
  saveUserCollections(collections);
  return newCard;
}
// update card
export function updateCardCollection(
  collectionId,
  cardIndex,
  question,
  answer
) {
  const collections = getUserCollections();
  if (!collections) return null;

  const currentUserEmail = getCurrentUser()?.email;
  if (!currentUserEmail) return null;

  const collection = collections.find(
    (c) => c.id === collectionId && c.userId === currentUserEmail
  );
  if (!collection) return null;

  // Safety: check if cardIndex is valid
  if (
    !collection.cards ||
    cardIndex < 0 ||
    cardIndex >= collection.cards.length
  ) {
    return null;
  }

  collection.cards[cardIndex] = {
    ...collection.cards[cardIndex],
    question,
    answer,
  };

  saveUserCollections(collections);
  return collection.cards[cardIndex];
}
//delete card
export function deleteCard(collectionId, cardIndex){
  const collections = getUserCollections();
  if (!collections) return null;

  const collection = collections.find(
    (c) => c.id === collectionId && c.userId === getCurrentUser()?.email
  );
  if (!collection) return null;
  console.log(collection.cards, cardIndex)
  collection.cards = collection.cards.filter((_, i) => i !== parseInt(cardIndex));
  console.log(collection.cards);
  saveUserCollections(collections);
  return;
}

// Delete collection
export function deleteCollection(collectionId) {
  const collections = getUserCollections();
  if (!collections) return false;

  const updatedCollections = collections.filter((c) => c.id !== collectionId);
  return saveUserCollections(updatedCollections);
}

export function updateCollection(name, collectionId) {
  const collections = getUserCollections();
  if (!collections) return false;

  const collection = collections.find((c) => c.id === collectionId);
  if (!collection) return false;

  collection.name = name;

  return saveUserCollections(collections);
}

export function loadSampleCards(collectionId) {
  const collections = getUserCollections();
  const currentUserEmail = getCurrentUser()?.email;
  if (!collections || !currentUserEmail) return null;

  const collection = collections.find(
    (c) => c.id === collectionId && c.userId === currentUserEmail
  );
  if (!collection) return null;

  if (collection.cards.length === 0) {
    const sampleCards = [
      {
        id: Date.now().toString() + "1",
        question: "What is JavaScript?",
        answer: "A programming language.",
      },
      {
        id: Date.now().toString() + "2",
        question: "What is HTML?",
        answer: "Markup language for web pages.",
      },
      {
        id: Date.now().toString() + "3",
        question: "What is CSS?",
        answer: "Stylesheet language for designing web pages.",
      },
    ];

    collection.cards.push(...sampleCards);
    saveUserCollections(collections);
    return sampleCards;
  }

  return null; // Already has cards
}
