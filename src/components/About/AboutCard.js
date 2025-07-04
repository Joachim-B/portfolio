import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Bonjour, Je suis <span className="purple">Joachim Bernard-Lambert </span>
            de <span className="purple"> Ploërmel, France.</span>
            <br />
            Je suis actuellement à la recherche de nouvelles opportunités d'<span className="purple"> alternance</span>.
            <br />
            J'ai complété un <span className="purple"> Bachelor Concepteur Développeur d'Applications </span>à CESI Brest.
            <br />
            <br />
            En dehors de programmer, voici quelques activités qui me passionnent aussi !
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
