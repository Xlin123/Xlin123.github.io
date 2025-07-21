import { useCallback, useEffect, useRef, useState } from 'react'
import { SelectedPage } from './shared/types';
import Home from './scenes/home';
import Navbar from './scenes/navbar';
import React from 'react';
import Projects from './scenes/projects';
import LoadingScreen from './shared/LoadingScreen';
import ThreeJSInstance from './shared/ThreeRenderer';
import DisplayedContent from './shared/DisplayedContent';
import PageManager from './shared/PageManager';

const App = () => {
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopOfPage(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const threeContainer = useRef<HTMLDivElement>(null);
  const threeRendererRef = useRef<ThreeJSInstance | null>(null);
  const pageManagerRef = useRef<PageManager | null>(null);


  useEffect(() => {
    if (!threeContainer.current) {
      console.log("❌ No container, exiting");
      return;
    }

    if (threeRendererRef.current) {
      console.log("❌ Renderer already exists, exiting");
      return;
    }



    threeContainer.current.style.visibility = 'hidden'; // Hide the container initially
    threeRendererRef.current = new ThreeJSInstance(threeContainer.current);
    threeRendererRef.current.render().then(() => {
      threeContainer.current!.style.visibility = 'visible';
      setIsLoading(false);
    });

    if (!pageManagerRef.current) {
      pageManagerRef.current = new PageManager(
        threeRendererRef.current!.setTargetCameraPosition.bind(threeRendererRef.current!),
        setSelectedPage
      );
    }

    return () => {
    };
  }, []);


  return (
    <div className="app bg-primary relative w-full h-full">
      {threeRendererRef.current && (
        <Navbar
          pageManager={pageManagerRef.current!}
          isTopOfPage={isTopOfPage}
        />
      )}
      <div ref={threeContainer} className="three-container top-0 left-0 w-full h-full z-5">
        {isLoading ? <LoadingScreen /> : null}
      </div>
      {!isLoading && threeRendererRef.current && (
        <div className='fixed top-0 left-0 w-full h-full opacity-90'>
          <DisplayedContent
            type={selectedPage}
            pageManager={pageManagerRef.current!}
          />
        </div>
      )}
    </div>
  );
};

export default App
