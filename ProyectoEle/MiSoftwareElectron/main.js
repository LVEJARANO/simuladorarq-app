const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, // Permitir Node.js en el frontend
            contextIsolation: false,
        },
        frame: true,
        fullscreen: false,
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.maximize();
}

app.whenReady().then(() => {
    createMainWindow();

    // Ruta absoluta del PDF
    const pdfPath = path.join(app.getAppPath(), 'pdf', 'Manual_Usuario_v1.1.pdf');
    console.log(`Ruta absoluta del PDF: ${pdfPath}`);

    // Enviar la ruta del PDF al renderer (frontend) usando IPC
    ipcMain.handle('get-pdf-path', () => {
        return pdfPath;
    });

    // Escuchar el mensaje para abrir el contenido de la "segunda ventana"
    ipcMain.on('open-second-window', () => {
        if (mainWindow) {
            mainWindow.loadFile('cantidad.html'); // Cargar el contenido de la segunda ventana
        }
    });

    // Escuchar el mensaje para regresar al contenido de la ventana principal
    ipcMain.on('goto-main-window', () => {
        if (mainWindow) {
            mainWindow.loadFile('index.html'); // Cargar el contenido de la ventana principal
        }
    });

    // Escuchar el mensaje para cerrar la aplicación
    ipcMain.on('exit-app', () => {
        console.log('Cerrando la aplicación...');
        app.quit();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// Cerrar la aplicación cuando todas las ventanas sean cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
