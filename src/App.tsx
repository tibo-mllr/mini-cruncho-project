import { ReactElement } from 'react';
import Header from './components/header';
import Map from './components/map';

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
