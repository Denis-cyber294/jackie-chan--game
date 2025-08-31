// resource.js
// Класс для загрузки ассетов (изображений)
export class ResourceManager {
  constructor() {
    this.images = {};
    this.onProgress = null;
    this.onComplete = null;
  }

  loadImages(images) {
    let loaded = 0;
    const total = images.length;
    if (total === 0) {
      if (this.onComplete) this.onComplete();
      return;
    }
    images.forEach((img) => {
      const image = new window.Image();
      image.src = img.src;
      image.onload = () => {
        this.images[img.key] = image;
        loaded++;
        if (this.onProgress) this.onProgress(loaded / total);
        if (loaded === total && this.onComplete) this.onComplete();
      };
      image.onerror = () => {
        loaded++;
        if (this.onProgress) this.onProgress(loaded / total);
        if (loaded === total && this.onComplete) this.onComplete();
      };
    });
  }

  getImage(name) {
    return this.images[name];
  }
}
