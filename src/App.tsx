import { ReactElement, useState } from 'react';
import Header from './components/header';
import Map from './components/map';
import { Card, Col, Container, Row, Table } from 'react-bootstrap';

export default function App(): ReactElement {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult>();

  const entriesToName: { [key: string]: string } = {
    formatted_address: 'Address',
    name: 'Name',
    price_level: 'Price level',
    rating: 'Rating',
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: '8px' }}>
        <Container>
          <Col>
            <Row style={{ paddingBottom: '8px' }}>
              <Map setSelectedPlace={setSelectedPlace} />
            </Row>
            <Row>
              <Col>
                {!!selectedPlace && (
                  <Card style={{ maxHeight: '30vh' }}>
                    <Card.Header>
                      <Card.Title>{selectedPlace.name}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={8}>
                          <Table>
                            <tbody>
                              {Object.entries(selectedPlace).map(([key, value]) => {
                                if (entriesToName[key]) {
                                  if (key === 'rating') {
                                    return (
                                      <tr key={key} style={{ borderBottomStyle: 'hidden' }}>
                                        <td>{entriesToName[key]}</td>
                                        <td>
                                          {value}/5 (based on {selectedPlace.user_ratings_total}{' '}
                                          ratings)
                                        </td>
                                      </tr>
                                    );
                                  }
                                  return (
                                    <tr key={key} style={{ borderBottomStyle: 'hidden' }}>
                                      <td>{entriesToName[key]}</td>
                                      <td>{value}</td>
                                    </tr>
                                  );
                                }
                                return '';
                              })}
                            </tbody>
                          </Table>
                        </Col>
                        <Col>
                          {!!selectedPlace.photos && (
                            <img
                              src={selectedPlace.photos[0].getUrl({
                                maxWidth: 350,
                                maxHeight: 160,
                              })}
                              alt={'Picture of ' + selectedPlace.name}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          </Col>
        </Container>
      </main>
    </>
  );
}
