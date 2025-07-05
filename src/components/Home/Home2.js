import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              UNE PETITE <span className="purple">PRÉSENTATION</span> S'IMPOSE
            </h1>
            <p className="home-about-body">
              Je suis tombé amoureux de la programmation, et j'ai peut-être appris quelque chose, je pense… 🤷‍♂️
              <br />
              <br />Je maîtrise des classiques comme
              <i>
                <b className="purple"> C#, Typescript et SQL. </b>
              </i>
              <br />
              <br />
              Mes domaines d'intérêt sont la création de&nbsp;
              <i>
                <b className="purple">programmes améliorant l'expérience utilisateur</b> ainsi que
                tout ce qui touche à l'
                <b className="purple">
                  optimisation et la clarté du code.
                </b>
              </i>
              <br />
              <br />
              Dès que possible, j'applique aussi ma passion pour le développement d'outils facilitant le quotidien et ouvrant des possibilités.
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>ME CONTACTER</h1>
            <p>
              <span className="purple"><a href="mailto:joachim.bernardlambert@gmail.com">joachim.bernardlambert@gmail.com</a></span>
              <br />
              <span className="purple">06 31 84 97 56</span>
            </p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
