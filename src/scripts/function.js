const { app, BrowserWindow, Menu } = require('electron');
const ipcRenderer = require('electron').ipcRenderer;

document.getElementById("aboutapp").onclick = function () {
    require('electron').shell.openExternal("https://aezral.github.io/azdl-page/");
}

document.getElementById("closeapp").onclick = function () {
    ipcRenderer.send('close-window');
}

document.getElementById("minapp").onclick = function () {
    ipcRenderer.send('minimize-window');
}

document.getElementById("maxiapp").onclick = function () {
    ipcRenderer.send('maximize-window');
}

document.getElementById("restapp").onclick = function () {
    ipcRenderer.send('quitapp')
}

document.getElementById("actdescvideo").onclick = function () {
    document.getElementById('descaudio').style.display = 'none';
    document.getElementById('descvideo').style.display = 'block';
    document.getElementById('actdescvideo').classList.add('active')
    document.getElementById('actdescaudio').classList.remove('active')
}

document.getElementById("actdescaudio").onclick = function () {
    document.getElementById('descaudio').style.display = 'block';
    document.getElementById('descvideo').style.display = 'none';
    document.getElementById('actdescvideo').classList.remove('active')
    document.getElementById('actdescaudio').classList.add('active')
}


document.getElementById('notificc').onclick = function () {
    var notificc = document.getElementById('notificc')
    var config1 = getconfig()
    if (notificc.checked) {
        config1.notification = true
        document.getElementById('notificc').setAttribute('checked', '')
        fs.writeFile(configpath, JSON.stringify(config1), 'utf-8', function (err) {
            if (err) throw err;
        })
    } else if (!notificc.checked) {
        config1.notification = false
        document.getElementById('notificc').removeAttribute('checked')
        fs.writeFile(configpath, JSON.stringify(config1), 'utf-8', function (err) {
            if (err) throw err;
        })
    }

}

document.getElementById('actprogressp').onclick = function () {
    var actprogressp = document.getElementById('actprogressp')
    var config2 = getconfig()
    var adbarras = document.getElementById('adbarras')
    var basicbarras = document.getElementById('basicbarras')
    if (actprogressp.checked) {
        config2.advanced = true
        document.getElementById('actprogressp').setAttribute('checked', '')
        fs.writeFile(configpath, JSON.stringify(config2), 'utf-8', function (err) {
            if (err) throw err;
        })
        basicbarras.style.display = "none"
        adbarras.style.removeProperty('display')
    } else if (!actprogressp.checked) {
        config2.advanced = false
        document.getElementById('actprogressp').removeAttribute('checked')
        fs.writeFile(configpath, JSON.stringify(config2), 'utf-8', function (err) {
            if (err) throw err;
        })
        adbarras.style.display = "none"
        basicbarras.style.removeProperty('display')
    }

}

document.getElementById('turndev').onclick = function () {
    ipcRenderer.send('turndev1')
}

document.getElementById('examruta').onclick = function () {
    document.getElementById('dlruta').click()
}

document.getElementById('dlruta').oninput = function () {

    ruta = document.getElementById('dlruta').files[0].path.replace(document.getElementById('dlruta').files[0].name, '').replace(/\\/g, "/")
    document.getElementById('downloadrt').value = ruta

}