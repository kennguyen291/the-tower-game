import { forwardRef } from "react";
import { TOWER_TYPES } from "../App";

import Plate from "../Plate";
import FireWork from "../FireWork";
import winningFlag from "../images/winning-flag.png";

import styles from "./styles.module.scss";

const Tower = forwardRef(({ name, plateList, onTowerClick, isWin }, ref) => {
  let isFlagShown = false;
  if (name === TOWER_TYPES.destination && isWin) {
    isFlagShown = true;
  }

  return (
    <div
      className={styles["tower__box"]}
      title={name}
      onClick={() => {
        onTowerClick(name);
      }}
      ref={ref}
    >
      {plateList.map((plate) => (
        <Plate
          key={plate.name}
          size={plate.size}
          color={plate.color}
          name={plate.name}
        />
      ))}
      <div className={styles["tower__pole"]}></div>
      <div className={styles["tower__base"]}></div>
      {isFlagShown && (
        <img
          src={winningFlag}
          title={"winning flag"}
          alt={"winning flag"}
        />
      )}
      {isFlagShown && <FireWork />}
    </div>
  );
});

export default Tower;