import styles from "./styles.module.scss";
import cs from "classnames";

const Plate = ({ size, color, name }) => {
  return (
    <div
      className={cs("plate-track", styles["plate"])}
      title={name}
      style={{
        backgroundColor: color,
        width: size + "px"
      }}
    ></div>
  );
};

export default Plate;