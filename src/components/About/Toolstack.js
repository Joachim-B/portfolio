import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiPostman,
  SiVisualstudio,
  SiGitextensions,
  SiMicrosoftoffice,
  SiSwagger,
  SiGitlab,
  SiGithub,
} from "react-icons/si";

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-vs">Visual Studio</Tooltip>}>
          <div className="icon-wrapper">
            <SiVisualstudio />
            <span className="icon-label">Visual Studio</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-vscode">VS Code</Tooltip>}>
          <div className="icon-wrapper">
            <SiVisualstudiocode />
            <span className="icon-label">VS Code</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-gitextensions">Git Extensions</Tooltip>}>
          <div className="icon-wrapper">
            <SiGitextensions />
            <span className="icon-label">Git Extensions</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-postman">Postman</Tooltip>}>
          <div className="icon-wrapper">
            <SiPostman />
            <span className="icon-label">Postman</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-office">Microsoft Office</Tooltip>}>
          <div className="icon-wrapper">
            <SiMicrosoftoffice />
            <span className="icon-label">Office</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-swagger">Swagger</Tooltip>}>
          <div className="icon-wrapper">
            <SiSwagger />
            <span className="icon-label">Swagger</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-github">GitHub</Tooltip>}>
          <div className="icon-wrapper">
            <SiGithub />
            <span className="icon-label">GitHub</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-gitlab">GitLab</Tooltip>}>
          <div className="icon-wrapper">
            <SiGitlab />
            <span className="icon-label">GitLab</span>
          </div>
        </OverlayTrigger>
      </Col>
    </Row>

  );
}

export default Toolstack;
