import './App.css';
import { ReactElement } from 'react';
import Header from './componnents/header';

export default function App(): ReactElement {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '5px' }}></main>
    </>
  );
}
