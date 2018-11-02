var items = document.getElementsByClassName('lattice__box')[0].getElementsByTagName("div");
var flag = true;
var randomArr = [];
var time;
getDom('start').onclick = function () {
    if (!flag) {
        return false;
    }
    flag = false;
    this.className = 'active';
    getDom('stop').className = '';
    time = setInterval(() => {
        randomArr = [];
        addRandomArr();
        defaultColor();
        for (let i in randomArr) {
            items[randomArr[i]].style.background = randomColor();
        }

    }, 1000)
};
getDom("stop").onclick = function () {
    clearInterval(time);
    flag = true;
    getDom('start').className = '';
    defaultColor();
};

function defaultColor() {
    for (let j = 0; j < items.length; j++) {
        items[j].style.background = "#FEA600";
    }
}

function getDom(name) {
    return document.getElementById(name);
}

function addRandomArr() {
    for (let i = 0; i < 3; i++) {
        let num = ~~(Math.random() * items.length);
        if (randomArr.length < 3) {
            if (randomArr.indexOf(num) < 0) {
                randomArr.push(num);
            } else {
                addRandomArr();
            }
        }
    }

}

function randomNumber() {
    return ~~(Math.random() * items.length);
}

function randomColor() {
    var red = ~~(Math.random() * 255);
    var blue = ~~(Math.random() * 255);
    var green = ~~(Math.random() * 255);
    return `rgb(${red}, ${blue}, ${green})`;
}