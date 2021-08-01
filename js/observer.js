const section1 = document.querySelector('#section1')
const section2 = document.querySelector('#section2')
const section3  = document.querySelector('#section3')
const features = document.querySelector('#features')
const reseñas = document.querySelector('#reseñas')
const importante = document.querySelector('#importante')
var nmb1 = 0
var nmb2 = 0

const observer1 = new IntersectionObserver(function (entries, observer) {
    if (entries[0].isIntersecting) {
        if (!reseñas.classList.contains('onsee')) {
            if (nmb1 === 0) {
                features.classList.add("onsee");
                nmb1++
            } else {
                features.classList.remove("onsee"); 
            }

        }
    } else {
        features.classList.remove("onsee");
    }
}, {
    threshold: 0
})
const observer2 = new IntersectionObserver(function (entries, observer) {
    if (entries[0].isIntersecting) {
        if (nmb2 === 0) {
        reseñas.classList.add("onsee");
        nmb2++
        } else {
            reseñas.classList.remove("onsee"); 
        }
    } else {
        reseñas.classList.remove("onsee");
    }
}, {
    threshold: 0
})
const observer3 = new IntersectionObserver(function (entries, observer) {
    if (entries[0].isIntersecting) {
        if (nmb2 === 0) {
        importante.classList.add("onsee");
        nmb2++
        } else {
            importante.classList.remove("onsee"); 
        }
    } else {
        importante.classList.remove("onsee");
    }
}, {
    threshold: 0
})







observer1.observe(section1)
observer2.observe(section2)
observer3.observe(section3)