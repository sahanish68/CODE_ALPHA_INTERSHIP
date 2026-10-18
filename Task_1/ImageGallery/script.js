const images = [
  { title: "Mountain View", category: "nature", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85", alt: "Snow-capped mountains under a blue sky" },
  { title: "City Skyline", category: "cities", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85", alt: "City skyline illuminated at dusk" },
  { title: "Cute Puppy", category: "animals", url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85", alt: "Golden retriever puppy looking at the camera" },
  { title: "Beach Paradise", category: "travel", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85", alt: "Turquoise ocean and tropical beach" },
  { title: "Adventure Awaits", category: "travel", url: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1000&q=85", alt: "Hiker looking toward mountain peaks" },
  { title: "Forest Cabin", category: "nature", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85", alt: "Sunlight filtering through a green forest" },
  { title: "Desert Wonders", category: "nature", url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=85", alt: "Golden desert dunes" },
  { title: "Street Life", category: "cities", url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85", alt: "Colorful city street with historic buildings" },
  { title: "Cat Portrait", category: "animals", url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1000&q=85", alt: "Cat sitting and looking toward the camera" },
  { title: "Flower Bloom", category: "nature", url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85", alt: "Colorful flowers in a garden" },
  { title: "Ocean Sunset", category: "travel", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85", alt: "Warm sunset over the ocean" },
  { title: "Forest Lake", category: "nature", url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85", alt: "Quiet lake surrounded by mountains and forest" }
];

const gallery = document.getElementById("gallery");
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const searchInput = document.getElementById("searchInput");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const imageCounter = document.getElementById("imageCounter");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let activeCategory = "all";
let visibleImages = [...images];
let currentIndex = 0;
let lastFocusedElement = null;

function createCard(image, index) {
  const card = document.createElement("article");
  card.className = "gallery-card";
  card.tabIndex = 0;
  card.setAttribute("aria-label", `Open ${image.title}`);
  card.innerHTML = `
    <img src="${image.url}" alt="${image.alt}" loading="lazy">
    <div class="card-overlay"><span class="zoom-icon" aria-hidden="true">⌕</span></div>
    <div class="card-info">
      <div><h2>${image.title}</h2><p>${categoryLabel(image.category)}</p></div>
      <button class="heart" aria-label="Like ${image.title}" aria-pressed="false" title="Like image">♡</button>
    </div>`;
  card.addEventListener("click", (event) => {
    if (event.target.closest(".heart")) return;
    openLightbox(index);
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      if (event.target.closest(".heart")) return;
      event.preventDefault();
      openLightbox(index);
    }
  });
  const heart = card.querySelector(".heart");
  heart.addEventListener("click", () => {
    const liked = heart.classList.toggle("liked");
    heart.textContent = liked ? "♥" : "♡";
    heart.setAttribute("aria-pressed", String(liked));
  });
  return card;
}

function categoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function renderGallery() {
  const query = searchInput.value.trim().toLowerCase();
  visibleImages = images.filter((image) => {
    const matchesCategory = activeCategory === "all" || image.category === activeCategory;
    const matchesSearch = `${image.title} ${image.category} ${image.alt}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  gallery.replaceChildren();
  visibleImages.forEach((image, index) => gallery.appendChild(createCard(image, index)));
  resultsCount.textContent = `${visibleImages.length} ${visibleImages.length === 1 ? "image" : "images"}`;
  emptyState.hidden = visibleImages.length !== 0;
}

function openLightbox(index) {
  if (!visibleImages.length) return;
  currentIndex = index;
  lastFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeBtn.focus();
}

function updateLightbox() {
  const image = visibleImages[currentIndex];
  lightboxImage.src = image.url;
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent = image.title;
  lightboxCategory.textContent = categoryLabel(image.category);
  imageCounter.textContent = `${currentIndex + 1} / ${visibleImages.length}`;
  prevBtn.disabled = visibleImages.length < 2;
  nextBtn.disabled = visibleImages.length < 2;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
}

function moveImage(direction) {
  if (!visibleImages.length) return;
  currentIndex = (currentIndex + direction + visibleImages.length) % visibleImages.length;
  updateLightbox();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderGallery();
  });
});
searchInput.addEventListener("input", renderGallery);
closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", () => moveImage(-1));
nextBtn.addEventListener("click", () => moveImage(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveImage(-1);
  if (event.key === "ArrowRight") moveImage(1);
});

renderGallery();
