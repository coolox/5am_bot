
function isSelfieAspect(photoWidth, photoHeight) {
    const aspectRatio = photoWidth / photoHeight;
    return aspectRatio >= 0.6 && aspectRatio <= 1.6; 
  }
  
  module.exports = isSelfieAspect;
  