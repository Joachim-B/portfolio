import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import cv from "../../Assets/CV_Joachim_Bernard_Lambert.pdf";
import lettreRecommendation from "../../Assets/Recommandation_Joachim.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const containerRefCV = useRef(null);
  const containerRefRec = useRef(null);

  const [containerWidthCV, setContainerWidthCV] = useState(0);
  const [containerWidthRec, setContainerWidthRec] = useState(0);

  const [pdfDimsCV, setPdfDimsCV] = useState({ width: 0, height: 0 });
  const [pdfDimsRec, setPdfDimsRec] = useState({ width: 0, height: 0 });

  const TARGET_SCALE = 1.7;

  useEffect(() => {
    const updateWidths = () => {
      if (containerRefCV.current) {
        setContainerWidthCV(containerRefCV.current.offsetWidth);
      }
      if (containerRefRec.current) {
        setContainerWidthRec(containerRefRec.current.offsetWidth);
      }
    };

    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, []);

  // Fonction pour calculer la largeur max possible à l’échelle cible
  const getTargetWidth = ({ width, height }) => {
    return width * TARGET_SCALE;
  };

  // Fonction pour décider si on applique scale fixe ou width responsive
  const getPageProps = (pdfDims, containerWidth) => {
    if (!pdfDims.width || !pdfDims.height || !containerWidth) {
      return { scale: TARGET_SCALE }; // fallback
    }

    const targetWidth = getTargetWidth(pdfDims);

    // Si le targetWidth dépasse la largeur du container => responsive via width
    if (targetWidth > containerWidth) {
      return { width: containerWidth };
    }
    // Sinon scale fixe (1.7)
    return { scale: TARGET_SCALE };
  };

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />

        {/* CV Button */}
        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            variant="primary"
            href={cv}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Télécharger CV
          </Button>
        </Row>

        {/* CV PDF */}
        <Row
          className="resume justify-content-center"
          ref={containerRefCV}
          style={{ margin: "0 auto" }}
        >
          <Document
            file={cv}
            className="d-flex justify-content-center"
            onLoadSuccess={(pdf) => {
              pdf.getPage(1).then((page) => {
                const { width, height } = page.getViewport({ scale: 1 });
                setPdfDimsCV({ width, height });
              });
            }}
          >
            <Page pageNumber={1} {...getPageProps(pdfDimsCV, containerWidthCV)} />
          </Document>
        </Row>

        {/* Recommandation Button */}
        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            variant="primary"
            href={lettreRecommendation}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Recommandation par Kerhis
          </Button>
        </Row>

        {/* Recommandation PDF */}
        <Row
          className="resume justify-content-center"
          ref={containerRefRec}
          style={{ margin: "0 auto" }}
        >
          <Document
            file={lettreRecommendation}
            className="d-flex justify-content-center"
            onLoadSuccess={(pdf) => {
              pdf.getPage(1).then((page) => {
                const { width, height } = page.getViewport({ scale: 1 });
                setPdfDimsRec({ width, height });
              });
            }}
          >
            <Page pageNumber={1} {...getPageProps(pdfDimsRec, containerWidthRec)} />
          </Document>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
