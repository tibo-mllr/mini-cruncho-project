import { ReactElement } from 'react';
import { Container, Navbar } from 'react-bootstrap';

export default function Header(): ReactElement {
  return (
    <header>
      <Navbar bg="cruncho" variant="cruncho" sticky="top">
        <Container fluid>
          <Navbar.Brand>
            <img src="logo192.png" height="30" className="d-inline-block align-top" alt="logo" />
            <b style={{ paddingLeft: '8px' }}>Mini project by Thibault</b>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </header>
  );
}
