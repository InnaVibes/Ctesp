import { useContext } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import styles from "./styles.module.scss";
import logo from "./logo.png";
import { UsersContext } from "../../contexts/UsersProvider";

const Header = () => {
  const { countUsers } = useContext(UsersContext);
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img className={styles.img} src={logo} alt="Logo" />
        <h1>PWA</h1>
      </div>
      {countUsers !== 0 && (
        <div className={styles.counts}>Users: {countUsers}</div>
      )}
      <Navbar pills={true} container={false} className={styles.navBar}>
        <NavbarBrand className={styles.link} href="/">
          Login
        </NavbarBrand>
        <NavbarBrand href="/">Register</NavbarBrand>
      </Navbar>
    </div>
  );
};

export default Header;
