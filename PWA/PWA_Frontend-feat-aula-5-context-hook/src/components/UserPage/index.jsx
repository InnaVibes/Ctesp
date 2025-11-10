import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { Tickets } from "./components/Tickets";
import { Perfil } from "./components/Perfil";
import { Member } from "./components/Member";
import "./styles.modules.scss";
import { useGetPerfil } from "../../hooks/useGetPerfil";
import {
  socketAddListener,
  socketRemoveListener,
  initSocket,
} from "../../socket/socket";
import { toast } from "react-toastify";

const UserPage = () => {
  const [activePage, setActivePage] = useState("1");
  const { isError, isLoading, user } = useStatePerfil("users");

  const listenerConfiguredRef = useRef(false);

  const newNotification = (data) => {
    if (data.key === "Game") {
      toast.warn(data.message, {
        position: "bottom-right",
        autoclose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.info(data.message, {
        position: "bottom-right",
        autoclose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    initSocket();

    const handleNotification = (data) => {
      newNotification(data);
    };

    if (!listenerConfiguredRef.current) {
      console.log("configurando ouvinte pela primeira vez");
      socketAddListener("admin_notifications", handleNotification);
      listenerConfiguredRef.current = true;
    } else {
      console.log("Ouvinte já configurado. Ignorando....");
    }

    return () => {
      socketRemoveListener("admin_notifications", handleNotification);
    };
  }, []);

  const navItems = [
    {
      id: "1",
      title: "Perfil",
    },
    {
      id: "2",
      title: "Tickets",
    },
    {
      id: "3",
      title: "Member",
    },
  ];

  const items = [
    {
      id: "1",
      children: <Perfil user={user.data} />,
    },
    {
      id: "2",
      children: <Tickets />,
    },
    {
      id: "3",
      children: <Member user={user.data} />,
    },
  ];

  return (
    <Container className={styles.container}>
      <h1>User {user.data.name}</h1>
      <Row className={styles.row}>
        <Nav tabs>
          {navItems.map((item) => {
            return (
              <NavItem key={item.id}>
                <NavLink
                  className={item.id === activePage ? styles.active : ""}
                  onClick={() => setActivePage(item.id)}
                >
                  {item.title}{" "}
                  {item.count && (
                    <span className={styles.count}>{item.count}</span>
                  )}
                </NavLink>
              </NavItem>
            );
          })}
        </Nav>
        <TabContent activeTab={activePage}>
          {items.map((item) => {
            return (
              <TabPane key={item.id} tabId={item.id}>
                {item.children}
              </TabPane>
            );
          })}
        </TabContent>
      </Row>
    </Container>
  );
};

export default UserPage;
