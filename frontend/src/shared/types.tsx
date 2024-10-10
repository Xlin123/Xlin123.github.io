import { ReactHTMLElement } from "react";

export enum SelectedPage {
  Home = "home",
  Demo = "demo",
  ContactUs = "contact"
}

export interface DescriptionType {
  picture: string;
  title: string;
  body: string,
  link: React.ReactNode;
}

export interface ItemType {
  name: string;
  description: string;
  image: string;
}

export interface LinePropsType {
  inputText: string;
  outputText: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setOutput: React.Dispatch<React.SetStateAction<string>>;
  websocketStream: WebSocket;
}