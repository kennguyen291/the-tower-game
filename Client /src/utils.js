export function getTranslateValues(element) {
    const style = window.getComputedStyle(element);
    const matrix =
      style["transform"] || style.webkitTransform || style.mozTransform;
  
    // No transform property. Simply return 0 values.
    if (matrix === "none" || typeof matrix === "undefined") {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  
    // Can either be 2d or 3d transform
    const matrixType = matrix.includes("3d") ? "3d" : "2d";
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
  
    // 2d matrices have 6 values
    // Last 2 values are X and Y.
    // 2d matrices does not have Z value.
    if (matrixType === "2d") {
      return {
        x: matrixValues[4],
        y: matrixValues[5],
        z: 0
      };
    }
  
    // 3d matrices have 16 values
    // The 13th, 14th, and 15th values are X, Y, and Z
    if (matrixType === "3d") {
      return {
        x: matrixValues[12],
        y: matrixValues[13],
        z: matrixValues[14]
      };
    }
  }
  
  export const movePlateUp = ({
    currentTimeStamp,
    start,
    previousTimeStamp,
    fromTowerRef,
    requestId,
    doneMoveUpCallback
  }) => {
    const plate = fromTowerRef && fromTowerRef.querySelector(".plate-track");
  
    if (!plate) return;
  
    const maxHeight =
      fromTowerRef.offsetHeight - (fromTowerRef.childElementCount - 1) * 13;
    if (start === undefined) start = currentTimeStamp;
    const elapsed = currentTimeStamp - start;
  
    if (previousTimeStamp !== currentTimeStamp) {
      const count = Math.min(0.7 * elapsed, maxHeight);
      plate.style.transform = "translateY(" + -count + "px)";
  
      if (count < maxHeight) {
        previousTimeStamp = currentTimeStamp;
        requestId = window.requestAnimationFrame((timeStamp) => {
          movePlateUp({
            currentTimeStamp: timeStamp,
            start,
            previousTimeStamp,
            fromTowerRef,
            requestId,
            doneMoveUpCallback
          });
        });
      } else {
        start = previousTimeStamp;
        doneMoveUpCallback && doneMoveUpCallback();
      }
    }
  };
  
  export const movePlateHorizontal = ({
    currentTimeStamp,
    start,
    previousTimeStamp,
    fromTowerRef,
    toTowerRef,
    requestId,
    doneMoveHorizontalCallback
  }) => {
    const plate = fromTowerRef && fromTowerRef.querySelector(".plate-track");
  
    if (!plate) return;
  
    const distanceDiff =
      fromTowerRef.getBoundingClientRect().left -
      toTowerRef.getBoundingClientRect().left;
  
    if (start === undefined) start = currentTimeStamp;
    const elapsed = currentTimeStamp - start;
  
    if (previousTimeStamp !== currentTimeStamp) {
      let count = Math.min(0.5 * elapsed, Math.abs(distanceDiff));
  
      count = distanceDiff > 0 ? -count : count;
  
      const previousTranslateY = getTranslateValues(plate)?.y;
      plate.style.transform = `translate(${count}px, ${previousTranslateY}px)`;
  
      if (Math.abs(count) < Math.abs(distanceDiff)) {
        previousTimeStamp = currentTimeStamp;
        requestId = window.requestAnimationFrame((timeStamp) => {
          movePlateHorizontal({
            currentTimeStamp: timeStamp,
            start,
            previousTimeStamp,
            fromTowerRef,
            toTowerRef,
            requestId,
            doneMoveHorizontalCallback
          });
        });
      } else {
        start = previousTimeStamp;
        doneMoveHorizontalCallback && doneMoveHorizontalCallback();
      }
    }
  };
  
  export const movePlateDown = ({
    currentTimeStamp,
    start,
    previousTimeStamp,
    fromTowerRef,
    toTowerRef,
    requestId,
    doneMoveDownCallback
  }) => {
    const plate = fromTowerRef && fromTowerRef.querySelector(".plate-track");
    if (!plate) return;
    const maxDistanceToMove =
      toTowerRef.offsetHeight - toTowerRef.childElementCount * 13;
    if (start === undefined) start = currentTimeStamp;
    const elapsed = currentTimeStamp - start;
    if (previousTimeStamp !== currentTimeStamp) {
      let count = 0.7 * elapsed;
      count = count <= maxDistanceToMove ? count : maxDistanceToMove;
  
      const previousTranslateX = getTranslateValues(plate)?.x;
  
      let finalTranslateY =
        -toTowerRef.offsetHeight +
        13 +
        13 +
        count +
        (fromTowerRef.childElementCount - 3) * 13;
  
      if (fromTowerRef === toTowerRef) {
        finalTranslateY = finalTranslateY + 13;
      }
  
      plate.style.transform = `translate(${previousTranslateX}px, ${finalTranslateY}px)`;
  
      if (count < maxDistanceToMove) {
        previousTimeStamp = currentTimeStamp;
        requestId = window.requestAnimationFrame((timeStamp) => {
          movePlateDown({
            currentTimeStamp: timeStamp,
            start,
            previousTimeStamp,
            fromTowerRef,
            toTowerRef,
            requestId,
            doneMoveDownCallback
          });
        });
      } else {
        doneMoveDownCallback && doneMoveDownCallback();
      }
    }
  };