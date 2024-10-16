const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let secondWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'render.js'), // Aquí puedes cambiar a 'renderer.js' si es necesario
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');
}

function createSecondWindow() {
    secondWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Puedes cambiar esto si es necesario
            nodeIntegration: true,
        },
    });

    secondWindow.loadFile('cantidad.html'); // Cargar la segunda ventana
}

app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

    ipcMain.on('open-second-window', () => {
        createSecondWindow();
        mainWindow.close(); // Cerrar la ventana principal si es necesario
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
