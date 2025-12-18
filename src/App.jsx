import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
const ThreeScene = React.lazy(() => import('./components/threeJsComponent/threeScene.jsx'));

import { Link } from 'react-router-dom';
import { Clock } from './components/myLib/clock/clock.jsx';
import { DOMENNAME } from './middlewares/initialState';
//import { Canvas } from "@react-three/fiber";
import './app.sass';
//import { Text3DComponent } from "./components/threeJsComponent/textComponent.jsx";
//import { PerspectiveCamera } from "@react-three/drei";
import { MyComponent } from './components/tsx/component.tsx';

export const App = () => {
  const slogans = [
    'Наша компания - ваш надежный\n партнер в перевозках.',
    'Гарантированная безопасность\n и сохранность ваших грузов.',
    'Мы доставим ваш груз туда,\n куда вам нужно, без проблем.',
    'Ваш груз в надежных руках\n – доверьтесь профессионалам.',
  ];

  const [backgroundImage, setBackgroundImage] = useState('');
  const [counter, setCounter] = useState(0);
  const [preloadImages, setPreloadImages] = useState([]);
  const [currentSlogan, setCurrentSlogan] = useState(slogans[0]);
  const [displayText, setDisplayText] = useState(false);

  const divStyle = useMemo(
    () => ({
      backgroundImage,
      height: 'calc(100vh - 16px)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
    [backgroundImage]
  );

  useEffect(() => {
    const images = [
      `${DOMENNAME}/img/trackPhone.png`,
      `${DOMENNAME}/img/trackPhone1.jpg`,
      `${DOMENNAME}/img/trackPhone3.png`,
      `${DOMENNAME}/img/trackPhone5.png`,
    ];
    const preload = images.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    setPreloadImages(preload);
  }, []);

  useEffect(() => {
    if (preloadImages.length === 0) return;

    const updateBackground = () => {
      setBackgroundImage(`url(${preloadImages[counter]?.src || ''})`);
      setCurrentSlogan(slogans[counter]);
      setDisplayText(true);

      setTimeout(() => {
        setDisplayText(false);
      }, 8250);

      setTimeout(() => {
        setCounter(prevCounter => (prevCounter < 3 ? prevCounter + 1 : 0));
      }, 10000);
    };

    updateBackground();
  }, [counter, preloadImages]);

  return (
    <div className="appRootDiv" style={divStyle}>
      <header className="appRootHeader">
        <div className="appRootLogo">
          <img className="appRootImg" src={`${DOMENNAME}/img/track.png`} height="50" width="80" />
        </div>
        <div className="appRootMenu">
          <Link to="/">Home</Link>
          <Link to="/something">Something</Link>
          <Link to="/oders">Заказы</Link>
          <Link to="/customer">Клиент</Link>
          <Link to="/auth">Вход</Link>
        </div>
      </header>
      <div className={`appSloganContainer ${displayText ? 'visible' : ''}`}>
        <h1>{currentSlogan}</h1>
      </div>
      <div className="appClockContainer">
        <Clock size={175} color="#0000ff" />
      </div>
      <div>
        <MyComponent text="TypeScript is working!!!" />
      </div>
      <div className="appCanvasContainer">
        <Suspense fallback={null}>
          <ThreeScene text={currentSlogan} />
        </Suspense>
      </div>
    </div>
  );
};
