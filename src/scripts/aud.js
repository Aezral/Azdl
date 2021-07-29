module.exports = {
    run: (ref, ruta, titulo, cau, info) => {
        const { createWriteStream } = require("fs");
        titulo = titulo.replace(/[/\\?%*:|"<>]/g, '');
        var path1 = ruta + "/" + titulo + ".mp3"
        const progressbarInterval = 1000;
        let progressbarHandle = null;
        var nmb = 0
        var nmb2 = 0
        
        const tracker = {
            start: Date.now(),
            audio: { downloaded: 0, total: Infinity },
            merged: { caume: 0, speed: '0x', fps: 0 },
        };
        var audio = ytdl(ref, { quality: cau.itag }).on('progress', (_, downloaded, total) => {
            tracker.audio = { downloaded, total };
        });


 
        document.getElementById('barraprogreso').style.width = (`${0}%`)

        document.getElementById('proceso').textContent = 'Descargando..'

        document.getElementById('configs').style.removeProperty('display')
        document.getElementById('cancelar').style.removeProperty('display')
        document.getElementById('progressp').style.removeProperty('display')
        document.getElementById('bbarraprogreso').style.removeProperty('display')
        document.getElementById('progressp').classList.add('showing')
        basicbarras.style.removeProperty('display')

        document.getElementById('actprogressp').style.display = 'none'
        document.getElementById('lactprog').style.display = 'none'
        document.getElementById('adbarras').style.display = 'none'
        
        document.getElementById('imagen2').src = '../images/image2.svg'
        $(':button').prop('disabled', true)
        $('#cancelar').prop('disabled', false)

        while (fs.existsSync(path1)) {
            if (titulo.charAt(titulo.length - 1) === ')' && titulo.charAt(titulo.length - 3) === '(') {
                nmb++
                titulo = titulo.replace(/.{0,4}$/, '');
                titulo = titulo + ` (${nmb})`
            } else if (titulo.charAt(titulo.length - 1) === ')' && titulo.charAt(titulo.length - 4) === '(') {
                nmb++
                titulo = titulo.replace(/.{0,4}$/, '');
                titulo = titulo + `(${nmb})`
            } else {
                nmb++
                titulo = titulo + ` (${nmb})`
            }
            path1 = ruta + "/" + titulo + '.mp3'

        }

        const showProgress = () => {
            readline.cursorTo(process.stdout, 0);
            const toMB = i => (i / 1024 / 1024).toFixed(2);

            process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
            process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

            process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
            readline.moveCursor(process.stdout, 0, -3);
        };

        const ffmpegProcess = cp.spawn(ffmpeg, [
            '-loglevel', '8', '-hide_banner',
            '-progress', 'pipe:3',
            '-i', 'pipe:4',
            '-map', '0:a',
            '-preset', 'ultrafast',
            path1
        ], {
            windowsHide: true,
            stdio: [
                /* Standard: stdin, stdout, stderr */
                'inherit', 'inherit', 'inherit',
                /* Custom: pipe:3, pipe:4, pipe:5 */
                'pipe', 'pipe'
            ],
        });

        ffmpegProcess.on('close', () => {
            var config = JSON.parse(fs.readFileSync(configpath))
            var notification = new Audio('../audio/notification.mp3')
            if (nmb2 === 0) {
                document.getElementById('proceso').textContent = 'Descarga terminada.'
                document.getElementById('imagen2').src = '../images/image3.svg'
                $(':button').prop('disabled', false)
                if (config.notification === true) {
                    notification.play()
                }
            } else if (nmb2 === 1) {
                document.getElementById('proceso').textContent = 'Descarga cancelada.'
                document.getElementById('imagen2').src = '../images/image4.svg'
                $(':button').prop('disabled', false)
            }
            process.stdout.write('\n\n\n\n');
            clearInterval(progressbarHandle);

            document.getElementById('barraprogreso').style.width = (`${0}%`)

            document.getElementById('bbarraprogreso').style.display = 'none'
            document.getElementById('cancelar').style.display = 'none'
            document.getElementById('configs').style.display="none"
            document.getElementById('actprogressp').style.removeProperty('display')
            document.getElementById('lactprog').style.removeProperty('display')
            
        });
        ffmpegProcess.on('error', e => {
            document.getElementById('proceso').textContent = 'Error.'
            document.getElementById('cancelar').style.display = 'none'
            document.getElementById('bbarraprogreso').style.display = 'none'
            document.getElementById('imagen2').src = '../images/image5.svg'
            $(':button').prop('disabled', false)
            process.stdout.write('\n\n\n\n');
            clearInterval(progressbarHandle);
            document.getElementById('configs').style.display="none"
            document.getElementById('actprogressp').removeProperty('display')
            document.getElementById('lactprog').style.removeProperty('display')
        });
        ffmpegProcess.stdio[3].on('data', chunk => {
            if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
            const lines = chunk.toString().trim().split('\n');
            const args = {};
            for (const l of lines) {
                const [key, value] = l.split('=');
                args[key.trim()] = value.trim();
            }
            tracker.merged = args;
            var completado = Number((tracker.audio.downloaded / tracker.audio.total * 100))
            console.clear()
            console.log(`Descargando | Audio: ${cau.audioBitrate}`)
            console.log(`Audio descargado: ${completado}% `)
            document.getElementById('barraprogreso').style.width = (`${completado}%`)
        });

        document.getElementById('cancelar').onclick = function () {
            ffmpegProcess.kill()
            audiopipe.end()
            document.getElementById('actprogressp').style.removeProperty('display')
            document.getElementById('lactprog').style.removeProperty('display')
            $(':button').prop('disabled', false)
            nmb2++
        }


        var audiopipe = audio.pipe(ffmpegProcess.stdio[4])



    }

}