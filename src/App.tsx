import { ReactElement } from 'react';
import Header from './componnents/header';
import Map from './componnents/map';

export default function App(): ReactElement {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '8px' }}>
        <Map />
      </main>
    </>
  );
}
