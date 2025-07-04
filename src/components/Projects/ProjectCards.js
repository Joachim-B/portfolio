import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";

function ProjectCards(props) {
  return (
    <Card className="project-card-view">
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {props.description}
        </Card.Text>
        {props.ghLink && (
          <Button variant="primary" href={props.ghLink} target="_blank">
            <BsGithub /> GitHub
          </Button>
        )}
        {props.dlLink && (
          <a href={"/portfolio" + props.dlLink} download target="_blank" rel="noopener noreferrer">
            <Button variant="primary">
              <IoMdDownload /> Télécharger le code
            </Button>
          </a>
        )}
        {"\n"}
        {"\n"}

        {/* If the component contains Demo link and if it's not a Blog then, it will render the below component  */}

        {props.demoLink && (
          <Button
            variant="primary"
            href={"/portfolio" + props.demoLink}
            target="_blank"
            style={{ marginLeft: "10px" }}
          >
            <CgWebsite /> &nbsp;
            {"Démo"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
