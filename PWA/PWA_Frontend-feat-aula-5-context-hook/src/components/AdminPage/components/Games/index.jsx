import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Table from "../../../Table";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { useGetData } from "../../hooks/useGetData";
import { usePostData } from "../../hooks/usePostData";
import { TabContext } from "../../contexts";

const Games = () => {
  const { register, handleSubmit } = useForm();
  const { isError, isLoading, data } = useGetData("games", 0, 0);
  const { isLoading: isLoadingPost, addData } = usePostData("games");
  const { setGamesCount } = useContext(TabContext);

  useEffect(() => {
    setGamesCount(data.data.length);
  }, [data, setGamesCount])

  if(isLoading) {
    return <div>Is Loading</div>
  }

  if(isError) {
    return <div>UPPSSSS</div>
  }

  return (
    <Container>
    <Row>
      <Col className={styles.column}>
        <h3>Create Game</h3>
        {
          isLoadingPost ? <div> is Loading </div> : ( <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit(addData)}>
              <div className={styles.field}>
                <label className={styles.label} for="date">
                  Date:
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  required="required"
                  {...register("date")}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} for="name">
                  Name:
                </label>
                <input
                  id="name"
                  name="name"
                  required="required"
                  {...register("name")}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} for="image">
                  Image:
                </label>
                <input
                  id="image"
                  name="image"
                  required="required"
                  {...register("image")}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} for="teamVisitor">
                  Visitor :
                </label>
                <input id="teamVisitor" name="teamVisitor"  {...register("team.visitor")} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} for="home">
                  Home :
                </label>
                <input
                  id="home"
                  name="home"
                  required="required"
                  {...register("team.home")}
                />
              </div>
              <Row>
                <input className="submit" type="submit" />
              </Row>
            </form>
          </div>)
        }
      </Col>
      <Col>
        <Table columns={["date", "name", "image", "team.visitor", "team.home"]} rows={data} />
      </Col>
    </Row>
  </Container>
  );
};

export default Games;
