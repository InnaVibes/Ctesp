import __ from "lodash";
import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import styles from "./styles.module.scss";

function QrcodeRead({ setDataLogin }) {
    const [data, setData] = useState("No result");

    return (
        <div className={styles.qrCodeReader}> 
            <Scanner
                onScane={(results) => {
                    const result = results[0];
                    const newResult = result.rawValue.split("%&");
                    const data = {
                        name: newResult[0],
                        password: newResult[1],
                        isQrCode: true,
                    };
                    setData(data);
                    setDataLogin(data);
                }}
                onError={(error) => console.log(error?.message)}
                constraints={{
                    facingMode: "user",
                }}
                scanDelay={300}
            />
            <p>(data.name)</p>
        </div>
    );
};

export default QrcodeRead;