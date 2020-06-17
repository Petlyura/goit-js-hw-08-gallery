import images from './gallery-items.js';

const refs = {
  galleryList: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
  lightboxContent: document.querySelector('.lightbox__content'),
  lightboxImage: document.querySelector('.lightbox__image'),
  closeModalBtn: document.querySelector(
    '.lightbox__button[data-action="close-lightbox"]',
  ),
};

const createListItem = function ({ preview, original, description }) {
  const listItem = document.createElement('li');
  listItem.classList.add('gallery__item');

  const listLink = document.createElement('a');
  listLink.classList.add('gallery__link');
  listLink.setAttribute('href', original);

  const listImage = document.createElement('img');
  listImage.classList.add('gallery__image');
  listImage.setAttribute('src', preview);
  listImage.setAttribute('data-source', original);
  listImage.setAttribute('alt', description);

  listLink.appendChild(listImage);
  listItem.appendChild(listLink);

  return listLink;
};

const renderGalleryList = (listRef, collection) => {
  const listItems = collection.map(item => createListItem(item));

  listRef.append(...listItems);
};

const generateOriginalSources = function () {
  return images.map(item => item.original);
};

renderGalleryList(refs.galleryList, images);

const changeImageSource = newSrc => {
  refs.lightboxImage.setAttribute('src', newSrc);
};

const removeImageSrc = () => {
  refs.lightboxImage.removeAttribute('src');
};

// Handlers
const handleGalleryClick = ({ target }) => {
  event.preventDefault();

  if (target.nodeName !== 'IMG') return;

  const originalSource = target.dataset.source;

  changeImageSource(originalSource);
};

const handleOpenModal = () => {
  window.addEventListener('keydown', handleEscapeClick);
  window.addEventListener('keydown', handleArrowScrolling);
  refs.modal.classList.add('is-open');
};

const handleModalClose = () => {
  refs.modal.classList.remove('is-open');
  removeImageSrc();
  window.removeEventListener('keydown', handleEscapeClick);
  window.removeEventListener('keydown', handleArrowScrolling);
};

const handleEscapeClick = ({ code }) => {
  if (code === 'Escape') {
    handleModalClose();
  }
};

const handleOverlayClick = ({ target, currentTarget }) => {
  if (target === currentTarget) {
    handleModalClose();
  }
};

function handleArrowScrolling({ code }) {
  const originalSources = generateOriginalSources();

  let index = originalSources.indexOf(refs.lightboxImage.src);

  if (code === 'ArrowRight') {
    if (index < originalSources.length - 1) {
      refs.lightboxImage.setAttribute('src', originalSources[index + 1]);
    } else {
      index = -1;
      refs.lightboxImage.setAttribute('src', originalSources[index + 1]);
    }
  }

  if (code === 'ArrowLeft') {
    if (index === 0) {
      index = originalSources.length;
      refs.lightboxImage.setAttribute('src', originalSources[index - 1]);
    } else refs.lightboxImage.setAttribute('src', originalSources[index - 1]);
  }
}

// Listeners
refs.galleryList.addEventListener('click', handleGalleryClick);
refs.galleryList.addEventListener('click', handleOpenModal);
refs.closeModalBtn.addEventListener('click', handleModalClose);
refs.lightboxContent.addEventListener('click', handleOverlayClick);
