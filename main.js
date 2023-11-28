const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200, // Try and get max val from machine and use that
        height: 800
    })
    if (!app.isPackaged) win.webContents.openDevTools()
    win.loadFile('index.html')
}
app.whenReady().then(() => {
    createWindow()

    // On Windows and Linux plattforms, exit app when all windows are closed
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
    // On Mac, create new window when app is activated
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});