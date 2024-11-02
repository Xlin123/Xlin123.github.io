import { useEffect, useState } from 'react'
import Home from './scenes/home';
import Navbar from './scenes/navbar';
import { SelectedPage } from './shared/types';
import ContactUs from './scenes/contact';
import Specs from './scenes/specs';
import React from 'react';
import Demo from './scenes/demo';
import { enable, generateRSAKeyPair } from './shared/EncryptionUtil';

const App = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);

  useEffect(() => {
    const generateKeyPair = async () => {
      const generatedKeyPair = await generateRSAKeyPair();
      setKeyPair(generatedKeyPair);
      enable(generatedKeyPair.publicKey, generatedKeyPair.privateKey);
    };
    generateKeyPair();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!keyPair) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app bg-primary-500">
      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <Home setSelectedPage={setSelectedPage} />
      <Demo setSelectedPage={setSelectedPage} />
      <ContactUs setSelectedPage={setSelectedPage} />
    </div>
  );
};

export default App
