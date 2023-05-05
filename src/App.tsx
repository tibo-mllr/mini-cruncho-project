import { ReactElement, useEffect, useReducer, useState } from 'react';
import Header from './components/header';
import Map from './components/map';
import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import { CustomPlace, Pair } from './utils';

export default function App(): ReactElement {
  const [selectedPlace, setSelectedPlace] = useState<CustomPlace>();
  const [finished, setFinished] = useState<boolean>(false);

  const reducer = (
    state: { pairs: Pair[]; map: google.maps.Map; infoWindow: google.maps.InfoWindow },
    action: {
      type: 'addPair' | 'reset' | 'setMap' | 'setInfoWindow';
      place?: CustomPlace;
      marker?: google.maps.Marker;
      map?: google.maps.Map;
      infoWindow?: google.maps.InfoWindow;
    },
  ): { pairs: Pair[]; map: google.maps.Map; infoWindow: google.maps.InfoWindow } => {
    switch (action.type) {
      case 'addPair':
        return {
          ...state,
          pairs: [
            ...state.pairs,
            { place: action.place as CustomPlace, marker: action.marker as google.maps.Marker },
          ],
        };
      case 'reset':
        return { pairs: [], map: {} as google.maps.Map, infoWindow: {} as google.maps.InfoWindow };
      case 'setMap':
        return { ...state, map: action.map as google.maps.Map };
      case 'setInfoWindow':
        return { ...state, infoWindow: action.infoWindow as google.maps.InfoWindow };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    pairs: [] as Pair[],
    map: {} as google.maps.Map,
    infoWindow: {} as google.maps.InfoWindow,
  });

  const entriesToName: { [key: string]: string } = {
    formatted_address: 'Address',
    name: 'Name',
    price_level: 'Price level',
    rating: 'Rating',
    opening_hours: 'Currently open',
  };

  const bestRated = (): Pair => {
    return state.pairs.reduce((prev, current) =>
      (prev.place.rating as number) > (current.place.rating as number) ? prev : current,
    );
  };

  const nearest = (): Pair => {
    return state.pairs.reduce((prev, current) =>
      prev.place.distance < current.place.distance ? prev : current,
    );
  };

  useEffect(() => {
    dispatch({ type: 'reset' });
  }, []);

  return (
    <>
      <Header />
      <main style={{ paddingTop: '8px' }}>
        <Container>
          <Col>
            <Row style={{ paddingBottom: '8px' }}>
              <Col md={9}>
                <Map
                  dispatch={dispatch}
                  setSelectedPlace={setSelectedPlace}
                  setFinished={setFinished}
                />
              </Col>
              <Col>
                {!!finished && (
                  <Card style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                    <Card.Header>
                      <Card.Title>Get the best around you</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Table>
                        <tbody>
                          <tr
                            style={{ borderBottomStyle: 'hidden', cursor: 'pointer' }}
                            onClick={(): void => {
                              setSelectedPlace(bestRated().place);
                              // Sometimes infoWindow is not set yet
                              // don't understand why since it's set in Map.tsx throw dispatch
                              if (state.infoWindow.setContent) {
                                state.infoWindow.setContent(
                                  bestRated().place.name +
                                    ' - ' +
                                    bestRated().place.distance.toFixed(2) +
                                    ' km from your location',
                                );
                                state.infoWindow.open(state.map, bestRated().marker);
                              }
                            }}
                          >
                            <td>
                              <b>Best rated</b>
                            </td>
                            <td>
                              {!!state.pairs && bestRated().place.name}
                              ,<br />
                              {!!state.pairs && bestRated().place.rating} / 5
                            </td>
                          </tr>
                          <tr
                            style={{ borderBottomStyle: 'hidden', cursor: 'pointer' }}
                            onClick={(): void => {
                              setSelectedPlace(nearest().place);
                              // Sometimes infoWindow is not set yet
                              // don't understand why since it's set in Map.tsx throw dispatch
                              if (state.infoWindow.setContent) {
                                state.infoWindow.setContent(
                                  nearest().place.name +
                                    ' - ' +
                                    nearest().place.distance.toFixed(2) +
                                    ' km from your location',
                                );
                                state.infoWindow.open(state.map, nearest().marker);
                              }
                            }}
                          >
                            <td>
                              <b>Nearest</b>
                            </td>
                            <td>
                              {nearest().place.name}
                              , <br />
                              {nearest().place.distance.toFixed(2)} km from your location
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                {!!selectedPlace && (
                  <Card>
                    <Card.Header>
                      <Card.Title>
                        {selectedPlace.name} - {selectedPlace.distance.toFixed(2)} km from your
                        location
                      </Card.Title>
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
                                        <td>
                                          <b>{entriesToName[key]}</b>
                                        </td>
                                        <td>
                                          {value}/5 (based on {selectedPlace.user_ratings_total}{' '}
                                          ratings)
                                        </td>
                                      </tr>
                                    );
                                  }
                                  if (key === 'opening_hours') {
                                    return (
                                      <tr key={key} style={{ borderBottomStyle: 'hidden' }}>
                                        <td>
                                          <b>{entriesToName[key]}</b>
                                        </td>
                                        <td>{value.isOpen() ? 'Yes' : 'No'}</td>
                                      </tr>
                                    );
                                  }
                                  return (
                                    <tr key={key} style={{ borderBottomStyle: 'hidden' }}>
                                      <td>
                                        <b>{entriesToName[key]}</b>
                                      </td>
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
