import { carouselTemplate } from "../templates/collectionsTemplates.js";
import { htmlToElement } from "../templates/utils.js";

export function createCarousel(collection) {
  const container = document.createElement("div");
  container.className = "custom-carousel";

  let currentIndex = 0;
  let showingAnswer = false;

  const card = document.createElement("div");
  card.className = "custom-card";
  card.dataset.index = currentIndex;

  const cardContent = document.createElement("div");
  cardContent.className = "card-content";
  cardContent.textContent =
    collection.cards[currentIndex]?.question || "No cards";
  card.appendChild(cardContent);

  card.onclick = () => {
    const currentCard = collection.cards[currentIndex];

    cardContent.classList.add("hidden");

    setTimeout(() => {
      showingAnswer = !showingAnswer;
      cardContent.textContent = showingAnswer
        ? currentCard.answer
        : currentCard.question;

      cardContent.classList.remove("hidden");
    }, 100);
  };

  const leftBtn = document.createElement("button");
  leftBtn.innerHTML = `<i class="ph ph-caret-left"></i>`;
  leftBtn.className = "carousel-btn left-btn";
  leftBtn.onclick = () => {
    if (collection.cards.length === 0) return;
    currentIndex =
      (currentIndex - 1 + collection.cards.length) % collection.cards.length;
    cardContent.textContent = collection.cards[currentIndex].question;
    card.dataset.index = currentIndex;
    showingAnswer = false;
  };

  const rightBtn = document.createElement("button");
  rightBtn.innerHTML = `<i class="ph ph-caret-right"></i>`;
  rightBtn.className = "carousel-btn right-btn ";
  rightBtn.onclick = () => {
    if (collection.cards.length === 0) return;
    currentIndex = (currentIndex + 1) % collection.cards.length;
    cardContent.textContent = collection.cards[currentIndex].question;
    card.dataset.index = currentIndex;
    showingAnswer = false;
  };

  // Append in order: Left → Card → Right
  container.appendChild(leftBtn);
  container.appendChild(card);
  container.appendChild(rightBtn);

  return container;
}
