import React from "react";
import { Container, Row, Col } from "reactstrap";
import Webcam from "react-webcam";
import styles from "./styles.module.scss";
export const CameraMedia = ({ setImage, imageFile }) => {
  return (
    <Container>
      <Row>
        <Col className={styles.camera}>
          <Webcam
            audio={false}
            height={240}
            screenshotFormat="image/jpeg"
            width={320}
          >
            {({ getScreenshot }) => (
              <button
                className={styles.cameraButton}
                onClick={(event) => {
                  event.preventDefault();
                  setImage(getScreenshot());
                }}
              >
                Capture photo
              </button>
            )}
          </Webcam>
        </Col>
        <Col>
          {imageFile && (
            <>
              <img alt="" src={imageFile} />
              <br></br>
              <a download="Selfie.jpg" href={imageFile}>
                Download Image
              </a>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
