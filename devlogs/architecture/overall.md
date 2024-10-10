flowchart TD
    A[("homelab")] --> C[(container daemon)] --> B[("backend")] 
    B --> F["container"]
    F --> G["sshnpd"]
    G --> H["sshnp process stream"]
    H --> D["websocket"]
<!-- [MermaidChart: 5824fdd2-1be2-4d8a-9b2f-c77f4c4c6ef1] -->
<!-- [MermaidChart: 5824fdd2-1be2-4d8a-9b2f-c77f4c4c6ef1] -->
    D --> M["frontend"]



