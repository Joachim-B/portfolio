import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import mwbot from "../../Assets/Projects/mw-bot2.png";
import aide_prepa from "../../Assets/Projects/aide_prepa_fac.png";
import hitman from "../../Assets/Projects/hitman.png";
import mastermind from "../../Assets/Projects/mastermind.png";
import bataille_navale from "../../Assets/Projects/batailleNavale.png";
import negosud from "../../Assets/Projects/negosud.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Mes <strong className="purple">Travaux </strong> Récents
        </h1>
        <p style={{ color: "white" }}>
          Voici quelques projets sur lesquels j'ai travaillé.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={mwbot}
              title="Bot Discord"
              description="Bot pour le réseau social Discord permettant de créer et gérer des tournois, gamifier l'accomplissement d'une tâche quotidienne, gérer les utilisateurs et automatiser certaines tâches."
              dlLink="/codebase/mw-bot.zip"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={aide_prepa}
              title="Automatisation de la Pré-Facturation"
              description="Outil éditeur de fichiers Excel, destiné au service administratif, qui génère un document facilitant la facturation des clients."
              dlLink="/codebase/aide_prepa_fac.zip"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={hitman}
              title="Jeu de Rôle - Hitman"
              description="Plateforme de lancer de dés en ligne pour les jeux de rôle, permettant aux joueurs de lancer des dés virtuels et de partager les résultats en temps réel."
              dlLink="/codebase/hitman.zip"
              demoLink="/jdr-hitman"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={negosud}
              title="Client lourd et API - Negosud"
              description="Logiciel de gestion de stocks, permettant de gérer les produits, les commandes et les clients."
              ghLink="https://github.com/Joachim-B/CUBE1-Negosud"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={mastermind}
              title="Mastermind"
              description="Jeu de mastermind conforme aux règles classiques."
              ghLink="https://github.com/Joachim-B/Mastermind"
              demoLink="/mastermind"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={bataille_navale}
              title="Bataille Navale"
              description="Jeu de bataille navale en ligne, permettant aux utilisateurs de s'affronter sur des grilles de jeu ou d'affronter un bot."
              ghLink="https://github.com/Joachim-B/Bataille-navale"
              demoLink="/bataille-navale"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
