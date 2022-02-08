import { useState, useEffect, useRef, useCallback } from "react";
import _isEqual from "lodash/isEqual";
import { movePlateDown, movePlateUp, movePlateHorizontal } from "./utils";

import Tower from "./Tower";
import warningRick from "./images/warning-rick.png";

import styles from "./styles.module.scss";

const plateList = [
  { name: "plate 1", size: "40", color: "red" },
  { name: "plate 2", size: "50", color: "green" },
  { name: "plate 3", size: "60", color: "blue" },
  { name: "plate 4", size: "70", color: "yellow" }
];

export const TOWER_TYPES = {
  source: "source",
  auxiliary: "auxiliary",
  destination: "destination"
};

export default function App() {
  const [typeOfPlate, setTypeOfPlate] = useState("");
  const [isWin, setIsWin] = useState(false);
  const [isDoneMoving, setIsDoneMoving] = useState(true);
  const [isShowWarning, setShowWarning] = useState(false);

  const [towerState, setTowerState] = useState({
    sourceList: [...plateList],
    auxiliaryList: [],
    destinationList: []
  });
  const [fromTower, setFromTower] = useState(null);
  const [toTower, setToTower] = useState(null);

  const sourceRef = useRef(null);
  const auxiliaryRef = useRef(null);
  const destinationRef = useRef(null);

  const reset = () => {
    setIsWin(false);
    setIsDoneMoving(true);
    setShowWarning(false);
    setTowerState({
      sourceList: [...plateList],
      auxiliaryList: [],
      destinationList: []
    });
    setFromTower(null);
    setToTower(null);
  };

  const moveItem = useCallback(
    (towerType, shiftItem) => {
      if (!fromTower || !toTower) return;
      const unShiftTowerName = `${TOWER_TYPES[towerType]}List`;
      const shiftTowerName = `${TOWER_TYPES[fromTower]}List`;

      setTowerState((prevState) => {
        let updatedTowerState = { ...prevState };

        const shiftTower = [...updatedTowerState[shiftTowerName]];
        shiftTower.shift();

        updatedTowerState = {
          ...updatedTowerState,
          [shiftTowerName]: [...shiftTower]
        };

        const unshiftTower = [...updatedTowerState[unShiftTowerName]];

        unshiftTower.unshift(shiftItem);

        updatedTowerState = {
          ...updatedTowerState,
          [unShiftTowerName]: [...unshiftTower]
        };

        setFromTower(null);
        setToTower(null);
        return {
          ...updatedTowerState
        };
      });
    },
    [fromTower, toTower]
  );

  useEffect(() => {
    // move()
  }, []);

  useEffect(() => {
    if (isShowWarning) {
      setTimeout(() => {
        setShowWarning(false);
      }, 800);
    }
  }, [isShowWarning]);

  useEffect(() => {
    let isWin = false;
    const { destinationList } = towerState;
    if (_isEqual(destinationList, plateList)) {
      isWin = true;
    }

    setIsWin(isWin);
  }, [towerState]);

  useEffect(() => {
    if (!fromTower) return;

    let requestId;

    let start;
    let previousTimeStamp;
    let fromTowerRef = null;
    let toTowerRef = null;

    if (fromTower && !toTower) {
      switch (fromTower) {
        case TOWER_TYPES.source:
          fromTowerRef = sourceRef.current;
          break;
        case TOWER_TYPES.auxiliary:
          fromTowerRef = auxiliaryRef.current;
          break;
        case TOWER_TYPES.destination:
          fromTowerRef = destinationRef.current;
          break;
        default:
      }

      const doneMoveUpCallback = () => {
        setIsDoneMoving(true);
      };

      setIsDoneMoving(false);
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
    }

    if (toTower) {
      switch (toTower) {
        case TOWER_TYPES.source:
          toTowerRef = sourceRef.current;
          break;
        case TOWER_TYPES.auxiliary:
          toTowerRef = auxiliaryRef.current;
          break;
        case TOWER_TYPES.destination:
          toTowerRef = destinationRef.current;
          break;
        default:
      }

      switch (fromTower) {
        case TOWER_TYPES.source:
          fromTowerRef = sourceRef.current;
          break;
        case TOWER_TYPES.auxiliary:
          fromTowerRef = auxiliaryRef.current;
          break;
        case TOWER_TYPES.destination:
          fromTowerRef = destinationRef.current;
          break;
        default:
      }

      const checkIsValidShift = (towerType) => {
        const towerStateName = `${TOWER_TYPES[towerType]}List`;
        if (updatedTowerState[towerStateName].length > 0) return true;

        return false;
      };

      const selectItemToMove = (towerType) => {
        const isValidToPop = checkIsValidShift(towerType);
        if (!isValidToPop) return;

        const towerStateName = `${TOWER_TYPES[towerType]}List`;

        const tobeShiftItem = updatedTowerState[towerStateName][0];
        return tobeShiftItem;
      };

      const updatedTowerState = { ...towerState };
      const shiftItem = selectItemToMove(fromTower);

      const doneMoveDownCallback = () => {
        moveItem(toTower, shiftItem);
        setIsDoneMoving(true);
      };

      const doneMoveHorizontalCallback = () => {
        setIsDoneMoving(false);
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
      };

      const unShiftTowerName = `${TOWER_TYPES[toTower]}List`;

      const unshiftTower = [...updatedTowerState[unShiftTowerName]];

      const isValidShift =
        unshiftTower?.length === 0 || unshiftTower[0]?.size >= shiftItem?.size;

      if (isValidShift) {
        setIsDoneMoving(false);
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
        setShowWarning(true);
        setIsDoneMoving(true);

        requestId = window.requestAnimationFrame((timeStamp) => {
          movePlateDown({
            currentTimeStamp: timeStamp,
            start,
            previousTimeStamp,
            fromTowerRef,
            toTowerRef: fromTowerRef,
            requestId,
            doneMoveDownCallback: () => {
              setFromTower(null);
              setToTower(null);
            }
          });
        });
      }
    }

    return () => {
      window.cancelAnimationFrame(requestId);
    };
  }, [fromTower, toTower, moveItem, towerState]);

  const checkTypeOfPlateText = (typeOfPlate) => {
    switch (typeOfPlate) {
      default:
        return "Hanoi";
    }
  };

  const onTowerClickHandler = (towerType) => {
    if (!isDoneMoving) return;

    if (isWin) return;

    if (!fromTower) {
      const towerStateName = `${TOWER_TYPES[towerType]}List`;
      if (towerState[towerStateName].length === 0) return;

      setFromTower(towerType);
    } else {
      setToTower(towerType);
    }
  };

  const { sourceList, auxiliaryList, destinationList } = towerState;

  return (
    <div className={styles["App"]}>
      <h1>THE TOWER</h1>
      <h2>Move all 4 PLATES from TOWER 1 to TOWER 3 to WIN THE GAME.</h2>
      <h3>Notes: smaller plate CAN NOT go underneath a bigger plate.</h3>
      <div className={styles["play-box"]}>
        <div
          className={styles["wrong-move__wrapper"]}
          style={{ opacity: isShowWarning ? "1" : "0" }}
        >
          <strong>NO</strong>
          <img
            src={warningRick}
            title={"wrong move!"}
            alt={"wrong move!"}
            className={styles["warning-rick"]}
          />
        </div>
        <div className={styles["towers-wrapper"]}>
          <Tower
            name={TOWER_TYPES.source}
            plateList={sourceList}
            onTowerClick={onTowerClickHandler}
            ref={sourceRef}
            isWin={isWin}
          />
          <Tower
            name={TOWER_TYPES.auxiliary}
            plateList={auxiliaryList}
            onTowerClick={onTowerClickHandler}
            ref={auxiliaryRef}
            isWin={isWin}
          />
          <Tower
            name={TOWER_TYPES.destination}
            plateList={destinationList}
            onTowerClick={onTowerClickHandler}
            ref={destinationRef}
            isWin={isWin}
          />
        </div>
        {isWin && (
          <button className={styles["button--restart"]} onClick={reset}>
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
