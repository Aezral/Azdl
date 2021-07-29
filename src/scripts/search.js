console.log('Bienvenido a la consola de desarrollador, si deseas regresar al modo normal, vuelve a dar click en el icono. ')
const downloadsFolder = require('downloads-folder');
const os = require('os')
const ytdl = require('ytdl-core');
const fs = require('fs')
const path = require('path')
const $ = require('jquery')
const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
const readline = require('readline');
var configpath = process.env.APPDATA + '\\azdl\\config.json'
var adbarras = document.getElementById('adbarras')
var basicbarras = document.getElementById('basicbarras')
var boton = document.getElementById('buscarinput')
const input = document.getElementById('busquedayt1')
var ruta = downloadsFolder().replace(/\\/g, "/")


document.getElementById('progressp').classList.remove('showing')
document.getElementById('downloadrt').value = ruta
document.getElementById('spinner2').style.display = 'none';
document.getElementById('descargas').style.display = 'none';
document.getElementById('descvideo-2160').style.display = 'none'
document.getElementById('descvideo-1440').style.display = 'none'
document.getElementById('descvideo-1080').style.display = 'none'
document.getElementById('descvideo-720').style.display = 'none'
document.getElementById('descvideo-480').style.display = 'none'
document.getElementById('descvideo-360').style.display = 'none'
document.getElementById('descvideo-144').style.display = 'none'
document.getElementById('progressp').style.display = 'none'
document.getElementById('configs').style.display = "none"

function getconfig() {
   return JSON.parse(fs.readFileSync(configpath))
}
function objeto(id) {
   return document.getElementById(id)
}
function calctam(cant) {
   let bytes = Number(cant)
   if (bytes < 1024) {
      return `${bytes}b`
   } else if (bytes >= 1024 && bytes < 1048576) {
      return `${Math.round(bytes / 1024, -1)}Kb`
   } else if (bytes >= 1048576 && bytes < 1073741824) {
      return `${Math.round(bytes / 1048576, -1)}Mb`
   } else if (bytes >= 1073741824 && bytes < 1099511627776) {
      return `${(bytes / 1073741824).toFixed(2)}Gb`
   }
}
function invalidfy(reason) {
   document.getElementById('invalidpapu').textContent = reason
   input.classList.remove('is-valid')
   input.classList.add('is-invalid')
   document.getElementById('spinner2').style.display = 'none';
}
function calcsec(cant) {
   let ms = Number(cant)
   if (ms < 1000) {
      return `${ms}Ms`
   } else if (ms >= 1000 && ms < 60000) {
      return `${Math.floor(ms / 1000)}Sec`
   } else if (ms >= 60000 && ms < 3600000) {
      if (Number.isInteger(ms / 60000)) {
         return `${Math.round(ms / 60000)} Min`
      } else {
         let minutos = Math.floor(ms / 60000)
         let segundos = Math.round((((Math.floor(ms / 1000)) / 60) - minutos) * 60)
         return `${minutos} Min ${segundos} Seg`
      }
   } else if (ms >= 3600000 && ms < 216000000) {
      if (Number.isInteger(ms / 3600000)) {
         return `${Math.round(ms / 3600000)} Hrs`
      } else {
         if (Number.isInteger((ms / 3600000) - Math.floor(ms / 3600000))) {
            let horas = Math.floor(ms / 3600000)
            let minutos = Math.floor((((Math.floor(ms / 60000)) / 60) - horas) * 60)
            return `${horas} Hrs ${minutos} Min`
         } else {
            let horas = Math.floor(ms / 3600000)
            let minutos = Math.floor(((((Math.floor(ms / 60000)) / 60) - horas) * 60))
            let segundos = Math.floor(((((((ms / 60000)) / 60) - horas) * 60) - minutos) * 60)
            return `${horas} Hrs ${minutos} Min ${segundos} Seg`
         }
      }
   }
}
function validfy() {

   input.classList.add('is-valid')
   input.classList.remove('is-invalid')
   document.getElementById('spinner2').style.display = 'none';
}

if (getconfig().notification === true) {
   document.getElementById('notificc').setAttribute('checked', '')
} else if (getconfig().notification === false) {
   document.getElementById('notificc').removeAttribute('checked')
}

if (getconfig().advanced === true) {
   document.getElementById('actprogressp').setAttribute('checked', '')
   basicbarras.style.display = "none"
   adbarras.style.removeProperty('display')
} else if (getconfig().advanced === false) {
   document.getElementById('actprogressp').removeAttribute('checked')
   adbarras.style.display = "none"
   basicbarras.style.removeProperty('display')
}








boton.onclick = async function () {
   document.getElementById('spinner2').style.display = 'inline-block';

   var ref = document.getElementById('busquedayt1').value
   ytdl.getInfo(ref).then(info => {
      validfy()
      if (info.videoDetails.isPrivate === false && info.videoDetails.isUnlisted === false) {
         if (info.videoDetails.isLiveContent === false) {
            validfy()
            document.getElementById('descvideo-144').style.display = 'none'
            document.getElementById('descvideo-360').style.display = 'none'
            document.getElementById('descvideo-480').style.display = 'none'
            document.getElementById('descvideo-720').style.display = 'none'
            document.getElementById('descvideo-1080').style.display = 'none'
            document.getElementById('descvideo-1440').style.display = 'none'
            document.getElementById('descvideo-2160').style.display = 'none'
            document.getElementById('descaudio-48').style.display = 'none'
            document.getElementById('descaudio-64').style.display = 'none'
            document.getElementById('descaudio-128').style.display = 'none'
            document.getElementById('descaudio-160').style.display = 'none'
            document.getElementById('progressp').style.display = 'none'
            document.getElementById('barraprogreso').style.width = (`0%`)

            var frvd = ytdl.filterFormats(info.formats, 'videoonly').filter(item => Boolean(item.contentLength))
            var frad = ytdl.filterFormats(info.formats, 'audioonly').filter(item => Boolean(item.contentLength))

            var titulo = info.videoDetails.title
            document.getElementById('titulovideo').textContent = titulo
            document.getElementById('imagen1').src = info.videoDetails.thumbnails[3].url
            document.getElementById('infovideo-a').textContent = "Autor: " + info.videoDetails.author.name
            document.getElementById('infovideo-d').textContent = "Duración: " + calcsec(info.videoDetails.lengthSeconds * 1000)

            document.getElementById('descargas').style.display = 'block'
            document.getElementById('infovideo').style.visibility = 'visible'

            var itemsProcessed = 0;
            var itemsProcessed2 = 0;
            lform1 = []
            lform2 = []
            frvd.forEach(a => {

               lform1.push(a.qualityLabel)
               itemsProcessed++
               if (itemsProcessed === frvd.length) {

                  document.getElementById('carga3').style.display = 'none'
                  if (lform1.includes('144p')) {
                     cal144 = frvd.filter(obj => { return obj.qualityLabel === '144p' })[0]
                     document.getElementById('descvideo-144').style.removeProperty('display');
                  } else if (lform1.includes('144p60')) {
                     cal144 = frvd.filter(obj => { return obj.qualityLabel === '144p60' })[0]
                     document.getElementById('descvideo-144').style.removeProperty('display');
                  } else if (lform1.includes('144p HDR')) {
                     cal144 = frvd.filter(obj => { return obj.qualityLabel === '144p HDR' })[0]
                     document.getElementById('descvideo-144').style.removeProperty('display');
                  } else if (lform1.includes('144p60 HDR')) {
                     cal144 = frvd.filter(obj => { return obj.qualityLabel === '144p60 HDR' })[0]
                     document.getElementById('descvideo-144').style.removeProperty('display');
                  }
                  if (lform1.includes('360p')) {
                     cal360 = frvd.filter(obj => { return obj.qualityLabel === '360p' })[0]
                     document.getElementById('descvideo-360').style.removeProperty('display');
                  } else if (lform1.includes('360p60')) {
                     cal360 = frvd.filter(obj => { return obj.qualityLabel === '360p60' })[0]
                     document.getElementById('descvideo-360').style.removeProperty('display');
                  } else if (lform1.includes('360p HDR')) {
                     cal360 = frvd.filter(obj => { return obj.qualityLabel === '360p HDR' })[0]
                     document.getElementById('descvideo-360').style.removeProperty('display');
                  } else if (lform1.includes('360p60 HDR')) {
                     cal360 = frvd.filter(obj => { return obj.qualityLabel === '360p60 HDR' })[0]
                     document.getElementById('descvideo-360').style.removeProperty('display');
                  }
                  if (lform1.includes('480p')) {
                     cal480 = frvd.filter(obj => { return obj.qualityLabel === '480p' })[0]
                     document.getElementById('descvideo-480').style.removeProperty('display');
                  } else if (lform1.includes('480p60')) {
                     cal480 = frvd.filter(obj => { return obj.qualityLabel === '480p60' })[0]
                     document.getElementById('descvideo-480').style.removeProperty('display');
                  } else if (lform1.includes('480p HDR')) {
                     cal480 = frvd.filter(obj => { return obj.qualityLabel === '480p HDR' })[0]
                     document.getElementById('descvideo-480').style.removeProperty('display');
                  } else if (lform1.includes('480p60 HDR')) {
                     cal480 = frvd.filter(obj => { return obj.qualityLabel === '480p60 HDR' })[0]
                     document.getElementById('descvideo-480').style.removeProperty('display');
                  }
                  if (lform1.includes('720p')) {
                     cal720 = frvd.filter(obj => { return obj.qualityLabel === '720p' })[0]
                     document.getElementById('descvideo-720').style.removeProperty('display');
                  } else if (lform1.includes('720p60')) {
                     cal720 = frvd.filter(obj => { return obj.qualityLabel === '720p60' })[0]
                     document.getElementById('descvideo-720').style.removeProperty('display');
                  } else if (lform1.includes('720p HDR')) {
                     cal720 = frvd.filter(obj => { return obj.qualityLabel === '720p HDR' })[0]
                     document.getElementById('descvideo-720').style.removeProperty('display');
                  } else if (lform1.includes('720p60 HDR')) {
                     cal720 = frvd.filter(obj => { return obj.qualityLabel === '720p60 HDR' })[0]
                     document.getElementById('descvideo-720').style.removeProperty('display');
                  }
                  if (lform1.includes('1080p')) {
                     cal1080 = frvd.filter(obj => { return obj.qualityLabel === '1080p' })[0]
                     document.getElementById('descvideo-1080').style.removeProperty('display');
                  } else if (lform1.includes('1080p60')) {
                     cal1080 = frvd.filter(obj => { return obj.qualityLabel === '1080p60' })[0]
                     document.getElementById('descvideo-1080').style.removeProperty('display');
                  } else if (lform1.includes('1080p HDR')) {
                     cal1080 = frvd.filter(obj => { return obj.qualityLabel === '1080p HDR' })[0]
                     document.getElementById('descvideo-1080').style.removeProperty('display');
                  } else if (lform1.includes('1080p60 HDR')) {
                     cal1080 = frvd.filter(obj => { return obj.qualityLabel === '1080p60 HDR' })[0]
                     document.getElementById('descvideo-1080').style.removeProperty('display');
                  }
                  if (lform1.includes('1440p')) {
                     cal1440 = frvd.filter(obj => { return obj.qualityLabel === '1440p' })[0]
                     document.getElementById('descvideo-1440').style.removeProperty('display');
                  } else if (lform1.includes('1440p60')) {
                     cal1440 = frvd.filter(obj => { return obj.qualityLabel === '1440p60' })[0]
                     document.getElementById('descvideo-1440').style.removeProperty('display');
                  } else if (lform1.includes('1440p HDR')) {
                     cal1440 = frvd.filter(obj => { return obj.qualityLabel === '1440p HDR' })[0]
                     document.getElementById('descvideo-1440').style.removeProperty('display');
                  } else if (lform1.includes('1440p60 HDR')) {
                     cal1440 = frvd.filter(obj => { return obj.qualityLabel === '1440p60 HDR' })[0]
                     document.getElementById('descvideo-1440').style.removeProperty('display');
                  }
                  if (lform1.includes('2160p')) {
                     cal2160 = frvd.filter(obj => { return obj.qualityLabel === '2160p' })[0]
                     document.getElementById('descvideo-2160').style.removeProperty('display');
                  } else if (lform1.includes('2160p60')) {
                     cal2160 = frvd.filter(obj => { return obj.qualityLabel === '2160p60' })[0]
                     document.getElementById('descvideo-2160').style.removeProperty('display');
                  } else if (lform1.includes('2160p HDR')) {
                     cal2160 = frvd.filter(obj => { return obj.qualityLabel === '2160p HDR' })[0]
                     document.getElementById('descvideo-2160').style.removeProperty('display');
                  } else if (lform1.includes('2160p60 HDR')) {
                     cal2160 = frvd.filter(obj => { return obj.qualityLabel === '2160p60 HDR' })[0]
                     document.getElementById('descvideo-2160').style.removeProperty('display');
                  }



                  frad.forEach(a => {
                     lform2.push(a.audioBitrate)
                     itemsProcessed2++
                     if (itemsProcessed2 === frad.length) {
                        caulist = []
                        if (lform2.includes(48)) {
                           caua48 = frad.filter(obj => { return obj.audioBitrate === 48 })[0]
                           caulist.push(48)
                           document.getElementById('descaudio-48').style.removeProperty('display');
                           document.getElementById('sza48').textContent = calctam(Number(caua48.contentLength))
                        }
                        if (lform2.includes(64)) {
                           caua64 = frad.filter(obj => { return obj.audioBitrate === 64 })[0]
                           caulist.push(64)
                           document.getElementById('descaudio-64').style.removeProperty('display');
                           document.getElementById('sza64').textContent = calctam(Number(caua64.contentLength))
                        }
                        if (lform2.includes(128)) {
                           caulist.push(128)
                           caua128 = frad.filter(obj => { return obj.audioBitrate === 128 })[0]
                           document.getElementById('descaudio-128').style.removeProperty('display');
                           document.getElementById('sza128').textContent = calctam(Number(caua128.contentLength))
                        }
                        if (lform2.includes(160)) {
                           caulist.push(160)
                           caua160 = frad.filter(obj => { return obj.audioBitrate === 160 })[0]
                           document.getElementById('descaudio-160').style.removeProperty('display');
                           document.getElementById('sza160').textContent = calctam(Number(caua160.contentLength))
                        }

                        if (caulist.includes(48)) {
                           cau144 = frad.filter(obj => { return obj.audioBitrate === 48 })[0]
                        } else if (!caulist.includes(48) && caulist.includes(64)) {
                           cau144 = frad.filter(obj => { return obj.audioBitrate === 64 })[0]
                        } else if (!caulist.includes(64) && caulist.includes(128)) {
                           cau144 = frad.filter(obj => { return obj.audioBitrate === 128 })[0]
                        } else if (!caulist.includes(128) && caulist.includes(160)) {
                           cau144 = frad.filter(obj => { return obj.audioBitrate === 160 })[0]
                        }

                        if (caulist.includes(64)) {
                           cau360 = frad.filter(obj => { return obj.audioBitrate === 64 })[0]
                        } else if (!caulist.includes(64) && caulist.includes(128)) {
                           cau360 = frad.filter(obj => { return obj.audioBitrate === 128 })[0]
                        } else if (!caulist.includes(128) && caulist.includes(160)) {
                           cau360 = frad.filter(obj => { return obj.audioBitrate === 160 })[0]
                        }

                        if (caulist.includes(64)) {
                           cau480 = frad.filter(obj => { return obj.audioBitrate === 64 })[0]
                        } else if (!caulist.includes(64) && caulist.includes(128)) {
                           cau480 = frad.filter(obj => { return obj.audioBitrate === 128 })[0]
                        } else if (!caulist.includes(128) && caulist.includes(160)) {
                           cau480 = frad.filter(obj => { return obj.audioBitrate === 160 })[0]
                        }

                        if (caulist.includes(128)) {
                           cau720 = frad.filter(obj => { return obj.audioBitrate === 128 })[0]
                        } else if (!caulist.includes(128) && caulist.includes(160)) {
                           cau720 = frad.filter(obj => { return obj.audioBitrate === 160 })[0]
                        }

                        if (caulist.includes(160)) {
                           cau1080 = frad.filter(obj => { return obj.audioBitrate === 160 })[0]
                        } else if (!caulist.includes(160) && caulist.includes(128)) {
                           cau1080 = frad.filter(obj => { return obj.audioBitrate === 128 })[0]
                        }

                        if (caulist.includes(160)) {
                           cau1440 = frad.filter(obj => { return obj.audioBitrate === 160 })[0]
                        } else if (!caulist.includes(160) && caulist.includes(128)) {
                           cau1440 = frad.filter(obj => { return obj.audioBitrate === 128 })[0]
                        }
                        if (caulist.includes(160)) {
                           cau2160 = frad.filter(obj => { return obj.audioBitrate === 160 })[0]
                        } else if (!caulist.includes(160) && caulist.includes(128)) {
                           cau2160 = frad.filter(obj => { return obj.audioBitrate === 128 })[0]
                        }
                        if (lform1.includes('144p60 HDR') || lform1.includes('144p60') || lform1.includes('144p HDR') || lform1.includes('144p')) {
                           document.getElementById('sz144').textContent = calctam(Number(cal144.contentLength) + Number(cau144.contentLength))
                        }
                        if (lform1.includes('360p60 HDR') || lform1.includes('360p60') || lform1.includes('360p HDR') || lform1.includes('360p')) {
                           document.getElementById('sz360').textContent = calctam(Number(cal360.contentLength) + Number(cau360.contentLength))
                        }
                        if (lform1.includes('480p60 HDR') || lform1.includes('480p60') || lform1.includes('480p HDR') || lform1.includes('480p')) {
                           document.getElementById('sz480').textContent = calctam(Number(cal480.contentLength) + Number(cau480.contentLength))
                        }
                        if (lform1.includes('720p60 HDR') || lform1.includes('720p60') || lform1.includes('720p HDR') || lform1.includes('720p')) {
                           document.getElementById('sz720').textContent = calctam(Number(cal720.contentLength) + Number(cau720.contentLength))
                        }
                        if (lform1.includes('1080p60 HDR') || lform1.includes('1080p60') || lform1.includes('1080p HDR') || lform1.includes('1080p')) {
                           document.getElementById('sz1080').textContent = calctam(Number(cal1080.contentLength) + Number(cau1080.contentLength))
                        }
                        if (lform1.includes('1440p60 HDR') || lform1.includes('1440p60') || lform1.includes('1440p HDR') || lform1.includes('1440p')) {
                           document.getElementById('sz1440').textContent = calctam(Number(cal1440.contentLength) + Number(cau1440.contentLength))
                        }
                        if (lform1.includes('2160p60 HDR') || lform1.includes('2160p60') || lform1.includes('2160p HDR') || lform1.includes('2160p')) {
                           document.getElementById('sz2160').textContent = calctam(Number(cal2160.contentLength) + Number(cau2160.contentLength))
                        }
                     }
                  })

               }

            })
            console.clear()
            console.log({
               "formatos": lform1
            })
            const azdl = require('../scripts/down')
            const auzdl = require('../scripts/aud')

            objeto('dlv144').onclick = function () {
               azdl.run(ref, ruta, titulo, cal144, cau144, info)
            }
            objeto('dlv360').onclick = function () {
               azdl.run(ref, ruta, titulo, cal360, cau360, info)
            }
            objeto('dlv480').onclick = function () {
               azdl.run(ref, ruta, titulo, cal480, cau480, info)
            }
            objeto('dlv720').onclick = function () {
               azdl.run(ref, ruta, titulo, cal720, cau720, info)
            }
            objeto('dlv1080').onclick = function () {
               azdl.run(ref, ruta, titulo, cal1080, cau1080, info)
            }
            objeto('dlv1440').onclick = function () {
               azdl.run(ref, ruta, titulo, cal1440, cau1440, info)
            }
            objeto('dlv2160').onclick = function () {
               azdl.run(ref, ruta, titulo, cal2160, cau2160, info)
            }

            objeto('dla48').onclick = function () {
               auzdl.run(ref, ruta, titulo, caua48, info)
            }
            objeto('dla64').onclick = function () {
               auzdl.run(ref, ruta, titulo, caua64, info)
            }
            objeto('dla128').onclick = function () {
               auzdl.run(ref, ruta, titulo, caua128, info)
            }
            objeto('dla160').onclick = function () {
               auzdl.run(ref, ruta, titulo, caua160, info)
            }




         } else {
            invalidfy('El video no puede ser una transmisión en vivo.')
         }
      } else {
         invalidfy('El video es privado o no listado.')
      }
   }).catch(e => {
      invalidfy('Error')
      console.log(e)
   })
}