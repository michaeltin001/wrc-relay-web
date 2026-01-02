import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const Scanner = ({ onScanSuccess }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, (error) => {
      console.warn(error);
    });

    return () => {
      scanner.clear();
    };
  }, []);

  return <div id="reader"></div>;
};

export default Scanner;
