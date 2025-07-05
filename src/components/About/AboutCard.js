import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Bonjour ! Je suis <span className="purple">Joachim Bernard-Lambert </span>
            de <span className="purple"> Ploërmel, en Bretagne.</span>
            <br />
            Je suis actuellement à la recherche d'une <span className="purple">alternance</span> pour mettre mes compétences en pratique.
            <br />
            <br />
            J'ai obtenu un <span className="purple"> Bachelor Concepteur Développeur d'Applications </span>à CESI Brest en 2024.
            <br />
            <br />
            En plus de programmer, j'ai aussi d'autres passions :
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Game Design
            </li>
            <li className="about-activity">
              <ImPointRight /> Intelligence Artificielle
            </li>
            <li className="about-activity">
              <ImPointRight /> Développement Personnel
            </li>
          </ul>

          {/* <p style={{ color: "rgb(155 126 172)" }}>
            "A goal without a plan is just a wish."{" "}
          </p>
          <footer className="blockquote-footer">Joachim Bernard-Lambert</footer> */}
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
