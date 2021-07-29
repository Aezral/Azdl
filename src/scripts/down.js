const { config } = require("process");

module.exports = {
    run: (ref, ruta, titulo, frv, fra, info) => {
        var config = getconfig()
        console.log(config)

        titulo = titulo.replace(/[/\\?%*:|"<>]/g, '');
        var path1 = ruta + "/" + titulo + ".mp4"
        var nmb = 0
        var nmb2 = 0
        let progressbarHandle = null;
        const progressbarInterval = 1000;

        const tracker = {
            start: Date.now(),
            audio: { downloaded: 0, total: Infinity },
            video: { downloaded: 0, total: Infinity },
            merged: { frame: 0, speed: '0x', fps: 0 },
        };
        var video = ytdl(ref, { quality: frv.itag }).on('progress', (_, downloaded, total) => {
            tracker.audio = { downloaded, total };
        });
        var audio = ytdl(ref, { quality: fra.itag }).on('progress', (_, downloaded, total) => {
            tracker.video = { downloaded, total };
        });


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
            path1 = ruta + "/" + titulo + '.mp4'
        }
        
        const showProgress = () => {
            readline.cursorTo(process.stdout, 0);
            const toMB = i => (i / 1024 / 1024).toFixed(2);
            readline.moveCursor(process.stdout, 0, -3);
        };


        $(':button').prop('disabled', true)
        $('#cancelar').prop('disabled', false)

        console.log(config)
        if (config.advanced === true) {
            basicbarras.style.display = "none"
            adbarras.style.removeProperty('display')
        } else if (config.advanced === false) {
            adbarras.style.display = "none"
            basicbarras.style.removeProperty('display')
        }

        const ffmpegProcess = cp.spawn(ffmpeg, [
            '-loglevel', '8', '-hide_banner',
            '-progress', 'pipe:3',
            '-i', 'pipe:4',
            '-i', 'pipe:5',
            '-map', '0:a',
            '-map', '1:v',
            '-preset', 'ultrafast',

            path1
        ], {
            windowsHide: true,
            stdio: [
                /* Standard: stdin, stdout, stderr */
                'inherit', 'inherit', 'inherit',
                /* Custom: pipe:3, pipe:4, pipe:5 */
                'pipe', 'pipe', 'pipe',
            ],
        });


        ffmpegProcess.on('close', () => {
            var config = getconfig()
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
            document.getElementById('videoprogreso').style.width = (`${0}%`)
            document.getElementById('audioprogreso').style.width = (`${0}%`)
            document.getElementById('encodprogreso').style.width = (`${0}%`)

            document.getElementById('bbarraprogreso').style.display = 'none'
            document.getElementById('cancelar').style.display = 'none'
            document.getElementById('basicbarras').style.display = 'none'
            document.getElementById('adbarras').style.display = "none"
            document.getElementById('configs').style.display = "none"
            console.clear()
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
            var vidcompl = Number((tracker.video.downloaded / tracker.video.total * 100).toFixed(2))
            var audcompl = Number((tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2))
            var codcompl = Math.round((Number(tracker.merged.frame, frv.fps * info.videoDetails.lengthSeconds) * 100) / (frv.fps * info.videoDetails.lengthSeconds))
            var completado = (vidcompl + audcompl + codcompl) / 3
            console.clear()
            console.log(`Descargando | Video: ${frv.qualityLabel} | Audio: ${fra.audioBitrate}`)
            console.log(`Video descargado: ${vidcompl}% | Audio Descargado: ${audcompl}% | Codificado: ${codcompl}% `)
            document.getElementById('barraprogreso').style.width = (`${completado}%`)
            document.getElementById('videoprogreso').style.width = (`${vidcompl}%`)
            document.getElementById('audioprogreso').style.width = (`${audcompl}%`)
            document.getElementById('encodprogreso').style.width = (`${codcompl}%`)
        });

        document.getElementById('cancelar').onclick = function () {
            ffmpegProcess.kill()
            audiopipe.end()
            videopipe.end()

            $(':button').prop('disabled', false)
            nmb2++
        }


        var audiopipe = audio.pipe(ffmpegProcess.stdio[4])
        var videopipe = video.pipe(ffmpegProcess.stdio[5])
        

        document.getElementById('barraprogreso').style.width = (`${0}%`)
        document.getElementById('videoprogreso').style.width = (`${0}%`)
        document.getElementById('audioprogreso').style.width = (`${0}%`)
        document.getElementById('encodprogreso').style.width = (`${0}%`)

        document.getElementById('proceso').textContent = 'Descargando..'

        document.getElementById('configs').style.removeProperty('display')
        document.getElementById('cancelar').style.removeProperty('display')
        document.getElementById('progressp').style.removeProperty('display')
        document.getElementById('progressp').classList.add('showing')

        document.getElementById('bbarraprogreso').style.removeProperty('display')
        

        document.getElementById('imagen2').src = '../images/image2.svg'


    }

}
