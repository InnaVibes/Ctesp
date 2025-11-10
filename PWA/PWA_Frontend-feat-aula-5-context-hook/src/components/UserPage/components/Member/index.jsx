import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Button } from "reactstrap";
import styles from "./styles.module.scss";
import { CameraMedia } from "../../../CameraMedia";
import { usePostData } from "../../../AdminPage/hooks/usePostData";
import { useGetMember } from "../../../../hooks/useGetMember";

export const Member = ({ user }) => {
  const localhost = "http://127.0.0.1:5000";
  const [showForm, setShowForm] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const { isLoading: isLoadingPost, addData } = usePostData(
    `users/${user._id}/member`
  );

  const { member } = useGetMember(user._id);
  const { register, handleSubmit, reset } = useForm();
  const isMember = user.role ? user.role.scopes.includes("member") : false;
  const addMember = (data) => {
    const body = {
      ...data,
      base64image: imageSrc,
    };
    addData(body);
  };
  useEffect(() => {
    if (isMember) {
      // reset form with user data
      reset(member);
    }
  }, [member, isMember]);
  if (!showForm && !isMember) {
    return (
      <Button className={styles.button} onClick={() => setShowForm(!showForm)}>
        Be a Member
      </Button>
    );
  }
  return (
    <Container>
      <Row>
        <Col className={styles.column}>
          <h3>Member Perfil</h3>
          <div className={styles.container}>
            {!isMember && (
              <form className={styles.form} onSubmit={handleSubmit(addMember)}>
                <div className={styles.field}>
                  <label className={styles.label} for="taxNumber">
                    Tax Number:
                  </label>
                  <input
                    id="taxNumber"
                    type="name"
                    name="taxNumber"
                    required="required"
                    {...register("taxNumber")}
                  />
                </div>
                <CameraMedia setImage={setImageSrc} imageFile={imageSrc} />
                <Row>
                  <input className="submit" type="submit" />
                </Row>
              </form>
            )}
            {isMember && (
              <>
                <div className={styles.field}>
                  <label className={styles.label} for="taxNumber">
                    Tax Number:
                  </label>
                  <span>{member.taxNumber}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} for="taxNumber">
                    Photo:
                  </label>
                  <img alt="" src={`${localhost}/${member.photo}`} />
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
