import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { TbBrandCSharp } from "react-icons/tb";
import {
  DiNodejs,
  DiPython,
  DiGit,
  DiJava,
  DiMsqlServer,
  DiHtml5,
  DiCss3,
  DiJavascript,
  DiPhp,
  DiDocker,
} from "react-icons/di";
import {
  SiTypescript,
  SiMysql,
  SiDotnet,
  SiSqlite
} from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-csharp">C#</Tooltip>}>
          <div className="icon-wrapper">
            <TbBrandCSharp />
            <span className="icon-label">C#</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-dotnet">.NET</Tooltip>}>
          <div className="icon-wrapper">
            <SiDotnet />
            <span className="icon-label">.NET</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-typescript">TypeScript</Tooltip>}>
          <div className="icon-wrapper">
            <SiTypescript />
            <span className="icon-label">TypeScript</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-nodejs">Node.js</Tooltip>}>
          <div className="icon-wrapper">
            <DiNodejs />
            <span className="icon-label">Node.js</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-mssql">SQL Server</Tooltip>}>
          <div className="icon-wrapper">
            <DiMsqlServer />
            <span className="icon-label">SQL Server</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-mysql">MySQL</Tooltip>}>
          <div className="icon-wrapper">
            <SiMysql />
            <span className="icon-label">MySQL</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-sqlite">SQLite</Tooltip>}>
          <div className="icon-wrapper">
            <SiSqlite />
            <span className="icon-label">SQLite</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-git">Git</Tooltip>}>
          <div className="icon-wrapper">
            <DiGit />
            <span className="icon-label">Git</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-python">Python</Tooltip>}>
          <div className="icon-wrapper">
            <DiPython />
            <span className="icon-label">Python</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-java">Java</Tooltip>}>
          <div className="icon-wrapper">
            <DiJava />
            <span className="icon-label">Java</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-html">HTML5</Tooltip>}>
          <div className="icon-wrapper">
            <DiHtml5 />
            <span className="icon-label">HTML5</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-css">CSS3</Tooltip>}>
          <div className="icon-wrapper">
            <DiCss3 />
            <span className="icon-label">CSS3</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-js">JavaScript</Tooltip>}>
          <div className="icon-wrapper">
            <DiJavascript />
            <span className="icon-label">JavaScript</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-php">PHP</Tooltip>}>
          <div className="icon-wrapper">
            <DiPhp />
            <span className="icon-label">PHP</span>
          </div>
        </OverlayTrigger>
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-docker">Docker</Tooltip>}>
          <div className="icon-wrapper">
            <DiDocker />
            <span className="icon-label">Docker</span>
          </div>
        </OverlayTrigger>
      </Col>
    </Row>


  );
}

export default Techstack;
