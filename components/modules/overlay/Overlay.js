import styles from './Overlay.module.css';

export default function Overlay(props) {
  return <div className={styles.overlay} onClick={props.onClick} />;
}
