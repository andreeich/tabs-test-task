# Exonn Tabs Test Task

## README

### Project Description

This project implements a tab management system using Vite, React, Shadcn, react-beautiful-dnd, usehooks-ts, and Tailwind. The following functionalities are implemented in this project:

1. **Tab Dragging**
2. **Tab Pinning**
3. **Tab Scrolling**
4. **Tabs State Persistence**
5. **Integration with Router**

### Functionalities

#### Tab Dragging

- Pinned tabs cannot be moved to the position of unpinned tabs and vice versa.
- Tabs can be dragged from the **left part** of the tab.

#### Tab Pinning

- Pinned tabs do not scroll with other tabs and should always remain visible.

#### Tab Scrolling

- Tabs that do not fit within the visible area of the container are displayed in a dropdown list.
- Shadows appear at the edges of the container if there are tabs that do not fit within the visible area.

#### Tabs State Persistence

- After page reload, the state of tabs is preserved.

#### Integration with Router

- Each tab is assigned a URL. When the active tab changes, navigation to the URL of that tab occurs.

### Features

Free space calculation is performed using a debounce function from the usehooks-ts package with a delay of 10ms.

### Scripts for Running

- `dev`: Starts the project in development mode.
- `build`: Compiles TypeScript and creates a production build of the project.
- `lint`: Runs ESLint to check the code.
- `preview`: Launches a preview of the project build.

```json
"scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
}
```
