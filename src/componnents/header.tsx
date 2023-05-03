import { ReactElement } from 'react';
import { Container, Navbar } from 'react-bootstrap';

export default function Header(): ReactElement {
  return (
    <header>
      <Navbar bg="cruncho" variant="dark" sticky="top">
        <Container fluid>
          <Navbar.Brand>
            <img src="logo192.png" height="30" className="d-inline-block align-top" alt="logo" />
          </Navbar.Brand>
        </Container>
      </Navbar>
    </header>
  );
}
