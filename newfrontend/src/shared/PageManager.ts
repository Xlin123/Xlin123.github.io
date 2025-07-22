import { SelectedPage } from "./types";



class PageManager {
    private setCameraPosition: (position: { x: number, y: number, z: number }) => void;
    private setSelectedPage: (page: SelectedPage) => void;
    constructor(setCameraPosition: (position: { x: number, y: number, z: number }) => void, setSelectedPage: (page: SelectedPage) => void) {
        this.setCameraPosition = setCameraPosition;
        this.setSelectedPage = setSelectedPage;
    }

    public setPage(page: SelectedPage): void {
        let newPosition = { x: 0, y: 0, z: 0 };
        this.setSelectedPage(page);
        console.log("Setting page to:", page);
        switch (page) {
            case 'home':
                newPosition = { x: 0.66, y: 0.7, z: 1.75 };
                break;
            case 'technical':
                newPosition = { x: 0.0, y: 0.8, z: 1.75 };
                break;
            case 'experience':
                newPosition = { x: 0.7, y: 0.6, z: -0.3 };
                break;
            case 'passion':
                newPosition = { x: 0, y: 1, z: -1.5 };
                break;
            case 'contact':
                newPosition = { x: 0.1, y: 0.8, z: -1.9 };
                break;
            default:
                newPosition = { x: 0.66, y: 0.7, z: 1.75 };
                break;
        }
        console.log("Setting camera position to: ", newPosition);
        // Update base position for mouse interactivity
        // Animate camera position smoothly to new position

        this.setCameraPosition(newPosition)
    }
}

export default PageManager;
