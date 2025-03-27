let nftWidth = 64;
let count = 0;
let waitingArray = [];

const width = window.innerWidth;

let pxRender;
let pxTextS;
let pxTextL;

if (width <= 768) {
    pxRender = 4;
    pxTextS = 10;
    pxTextL = 12;
} else {
    pxRender = 6;
    pxTextS = 14;
    pxTextL = 16;
}
function generatePlanet() {
    let planet = selectRandomPlanet();
    let planetDetails = getPlanetDetails(planet);
    let array = initializeArray();
    let colors = initializeColors();

    disableDownloadBtn(planetDetails.namePlanet);
    
    renderArray(array);

    fillArrayWithRandomColors(array, colors).then(() => {
        spreadColors(array).then(() => {
            drawPlanetBorder(array, planetDetails.sizePlanet).then(() => {
                drawPattern(array, planetDetails.sizePlanet).then(async () => {
                    drawStars(array).then(async () => {
                        $('#planet-name').text(planetDetails.namePlanet);
                        $('#system-name').text(planetDetails.systemPlanet);
                        $("#reload > i").removeClass("rotate-icon rotate");
                        createCanvas(planetDetails);
                    });
                });
            });
        });
    });
}

function selectRandomPlanet() {
    return planets[getRandomIntWithMin(0, planets.length)];
}

function getPlanetDetails(planet) {
    return {
        numberPlanet: planet[0],
        namePlanet: planet[1],
        systemPlanet: planet[2],
        distancePlanet: (+planet[5] * 3.2615637769).toFixed(2),
        radiusPlanet: (+planet[6]).toFixed(2),
        massPlanet: (+planet[7]).toFixed(2),
        periodPlanet: (+planet[8]).toFixed(2),
        sizePlanet: getRandomIntWithMin(3, 19)
    };
}

function initializeArray() {
    let array = [];
    for (let i = 0; i < nftWidth; i++) {
        array[i] = [];
        for (let j = 0; j < nftWidth; j++) {
            array[i][j] = '';
        }
    }
    return array;
}

function initializeColors() {
    return [
        // Originales
        ['#CA3C66', '#DB6A8F', '#E8AABE', '#A7E0E0', '#4AA3A2'],
        ['#e5e7e6', '#EEE6D8', '#DAAB3A', '#B67332', '#93441A'],
        ['#E1A624', '#317AC1', '#384454', '#D4D3DC', '#AD956B'],
        ['#AFA4CE', '#F0A1BF', '#F5DF4D', '#939597', '#8CACD3'],
        ['#27C7D4', '#FFFFFF', '#FDF0E7', '#FE9063', '#EA5863'],
        ['#55D5E0', '#335F8A', '#2F4558', '#F6B12D', '#F26619'],
        ['#6dd2e7', '#bbecd8', '#fbf8f3', '#ced2cd', '#91e0be'],

        // Flashy & Néon
        ['#FF2079', '#FF4C00', '#FFF700', '#0AFF99', '#1E90FF'],
        ['#D900FF', '#6B00FF', '#002BFF', '#00A6FF', '#00FFD0'],
        ['#FF00A6', '#FF007F', '#FF005E', '#FF0000', '#FFD700'],

        // Pastel & Doux
        ['#FFC3A0', '#FFD3B6', '#D4A5A5', '#A8E6CF', '#FF8C94'],
        ['#B2B2B2', '#D6CFC7', '#B5EAD7', '#FFDAC1', '#E2F0CB'],
        ['#F8BBD0', '#F48FB1', '#CE93D8', '#B39DDB', '#9FA8DA'],

        // Ternes & Terreux
        ['#8D6E63', '#A1887F', '#C7B299', '#D9BF77', '#A3866A'],
        ['#554236', '#F77825', '#D3CE3D', '#9D9C62', '#D6A679'],
        ['#5A3E36', '#8F6E68', '#B99A8F', '#D1B0A3', '#E1C5B1'],

        // Futuriste & Métallisé
        ['#1C1C1C', '#505050', '#A0A0A0', '#D0D0D0', '#F0F0F0'],
        ['#002244', '#004488', '#0066CC', '#0088FF', '#00AAFF'],
        ['#B0BEC5', '#78909C', '#546E7A', '#37474F', '#263238'],

        // Galaxie & Cosmos
        ['#0D0221', '#3E1F47', '#752F97', '#B07DB5', '#E5C3FF'],
        ['#050A30', '#1C1C72', '#5D5DFF', '#8585F6', '#BABAEF'],
        ['#070F2B', '#1B1A55', '#535C91', '#9290C3', '#D7BCE8'],
    ];
}

async function updatePixel(array, i, j, color) {
    waitingArray.push({'i': i,'j': j,'color': color});
    array[i][j] = color;

    if (waitingArray.length >= 25) {
        await renderWaitingPixel(array);
        waitingArray = [];
    }
}

async function updateLastPixel(array) {
    await renderWaitingPixel(array);
    waitingArray = [];
}

function renderWaitingPixel(array) {
    return new Promise(resolve => {
        setTimeout(() => {
            waitingArray.forEach(({ i, j, color }) => {
                renderPixel(i, j, color);
            });
            resolve();
        }, 0);
    });
}

function renderPixel(i, j, color) {
    $('#row-' + i).find('div').eq(j).css('background', color);
}


async function fillArrayWithRandomColors(array, colors) {
    let randomColor = getRandomIntWithMin(0, colors.length);
    let numberOfGroups = 80;

    for (let i = 0; i < numberOfGroups; i++) {
        let randomPointsColumn = getRandomInt(array.length);
        let randomPointsRow = getRandomInt(array[randomPointsColumn].length);
        let randomColorFinal = colors[randomColor][i % colors[randomColor].length];

        await updatePixel(array, randomPointsColumn, randomPointsRow, randomColorFinal);
    }

    await updateLastPixel(array);
}

async function spreadColors(array) {
    let finsh = false;
    while (!finsh) {
        let itsFinish = true;
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                let color = array[i][j];
                let random = getRandomInt(3);
                if (i > 0 && j > 0 && i < nftWidth - 1 && j < nftWidth - 1) {
                    if (array[i][j] == '') {
                        itsFinish = false;
                    }
                }
                if (i > 0 && j > 0 && i < nftWidth - 1 && j < nftWidth - 1 && random == 1 && color != '') {
                    if (array[i + 1][j] == '') {
                        await updatePixel(array, i + 1, j, color);
                    }
                    if (array[i - 1][j] == '') {
                        await updatePixel(array, i - 1, j, color);
                    }
                    if (array[i][j + 1] == '') {
                        await updatePixel(array, i, j + 1, color);
                    }
                    if (array[i][j - 1] == '') {
                        await updatePixel(array, i, j - 1, color);
                    }
                }
            }
        }
        if (itsFinish) {
            finsh = true;
        }
    }
    await updateLastPixel(array);
}

async function drawPlanetBorder(array, sizePlanet) {
    let planetBorder = sizePlanet;
    let startXRight = planetBorder;
    let startXLeft = (nftWidth - 1) - planetBorder;

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (i < startXRight || i > startXLeft || j < startXRight || j > startXLeft) {
                await updatePixel(array, i, j, '#000000');
            }
        }
    }
}

async function drawPattern(array, sizePlanet) {
    let planetBorder = sizePlanet;
    let whiteBand = {
        3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4,
    };
    let pattern = {
        3: [0, 1, 2, 2, 3, 3, 3, 2, 4, 3, 3, 3, 4, 4, 5, 6],
        4: [0, 1, 2, 3, 2, 3, 3, 3, 3, 3, 3, 4, 3, 4, 5, 6],
        5: [0, 2, 2, 2, 3, 2, 3, 3, 3, 4, 3, 4, 4, 4, 6],
        6: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 6],
        7: [0, 2, 2, 3, 2, 3, 3, 3, 3, 4, 3, 4, 4, 6],
        8: [1, 1, 3, 2, 3, 3, 3, 3, 3, 3, 4, 3, 5, 5],
        9: [1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5],
        10: [1, 2, 2, 3, 2, 3, 3, 4, 3, 4, 4, 5],
        11: [1, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 5],
        12: [0, 2, 3, 2, 3, 3, 3, 4, 3, 4, 6],
        13: [1, 2, 2, 3, 3, 3, 3, 3, 4, 4, 5],
        14: [1, 2, 2, 3, 3, 3, 3, 4, 4, 5],
        15: [1, 2, 3, 2, 3, 4, 3, 4, 5],
        16: [1, 2, 3, 3, 3, 3, 3, 4, 5],
        17: [1, 3, 2, 3, 3, 4, 3, 5],
        18: [2, 2, 3, 3, 3, 3, 4, 4],
    };

    let whiteBandSelected = whiteBand[planetBorder];
    let patternSelected = pattern[planetBorder];

    let startXRight = planetBorder;
    let startXLeft = (nftWidth - 1) - planetBorder;

    let roundSize = (nftWidth / 2) - planetBorder - whiteBandSelected;
    let roundSize2 = nftWidth - planetBorder - whiteBandSelected;

    await drawPatternPartSection(array, patternSelected, startXRight, roundSize, planetBorder, true, true);
    await drawPatternPartSection(array, patternSelected, startXLeft, roundSize, planetBorder, false, true);
    await drawPatternPartSection(array, patternSelected, startXRight, roundSize, planetBorder, true, false);
    await drawPatternPartSection(array, patternSelected, startXLeft, roundSize, planetBorder, false, false, roundSize2);
}

async function drawPatternPartSection(array, patternSelected, startX, roundSize, planetBorder, isRight, isUpper, roundSize2 = 0) {
    let height = isUpper ? roundSize + planetBorder : (63 - roundSize) - planetBorder;
    let step = 0;
    let increment = isRight ? 1 : -1;

    roundSize = !isRight && !isUpper ? roundSize2 : roundSize;

    for (let i = startX; isRight ? i < roundSize + startX : i > startX - roundSize; i += increment) {
        let found = false;
        let val = patternSelected[step];
        for (let j = 3; j < (isUpper ? roundSize + planetBorder : nftWidth - planetBorder); j++) {
            if (isUpper ? (val == 0 && j < height) : (val == 0 && j > height)) {
                found = 0;
                await updatePixel(array, i, j, '#000000');
            } else if (isUpper ? (val == 1 && j < height) : (val == 1 && j > height)) {
                found = 1;
                await updatePixel(array, i, j, '#000000');
            } else if (isUpper ? (val == 2 && j < height) : (val == 2 && j > height)) {
                found = 2;
                await updatePixel(array, i, j, '#000000');
            } else if (isUpper ? (val == 3 && j < height) : (val == 3 && j > height)) {
                found = 3;
                await updatePixel(array, i, j, '#000000');
            } else if (isUpper ? (val == 4 && j < height) : (val == 4 && j > height)) {
                found = 4;
                await updatePixel(array, i, j, '#000000');
                await updatePixel(array, i + increment, j, '#000000');
            } else if (isUpper ? (val == 5 && j < height) : (val == 5 && j > height)) {
                found = 5;
                await updatePixel(array, i, j, '#000000');
                await updatePixel(array, i + increment, j, '#000000');
                await updatePixel(array, i + 2 * increment, j, '#000000');
            } else if (isUpper ? (val && j < height) : (val && j > height)) {
                found = 6;
                await updatePixel(array, i, j, '#000000');
                await updatePixel(array, i + increment, j, '#000000');
                await updatePixel(array, i + 2 * increment, j, '#000000');
                await updatePixel(array, i + 3 * increment, j, '#000000');
            }
        }
        if (found == 0) {
            height = isUpper ? height - 4 : height + 4;
            step++;
        } else if (found == 1) {
            height = isUpper ? height - 3 : height + 3;
            step++;
        } else if (found == 2) {
            height = isUpper ? height - 2 : height + 2;
            step++;
        } else if (found == 3) {
            height = isUpper ? height - 1 : height + 1;
            step++;
        } else if (found == 4) {
            height = isUpper ? height - 1 : height + 1;
            i += increment;
            step++;
        } else if (found == 5) {
            height = isUpper ? height - 1 : height + 1;
            i += 2 * increment;
            step++;
        } else if (found == 6) {
            height = isUpper ? height - 1 : height + 1;
            i += 3 * increment;
            step++;
        }
    }
    await updateLastPixel(array);
}

async function drawStars(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (i > 0 && j > 0 && i < nftWidth - 1 && j < nftWidth - 1) {
                if (array[i][j] == "#000000" && array[i + 1][j] != "#000000") {
                    await updatePixel(array, i + 1, j, '#ffffff');
                }
                if (array[i][j] == "#000000" && array[i - 1][j] != "#000000") {
                    await updatePixel(array, i - 1, j, '#ffffff');
                }
                if (array[i][j] == "#000000" && array[i][j + 1] != "#000000") {
                    await updatePixel(array, i, j + 1, '#ffffff');
                }
                if (array[i][j] == "#000000" && array[i][j - 1] != "#000000") {
                    await updatePixel(array, i, j - 1, '#ffffff');
                }
            }
            if (i > 0 && j > 0 && i < nftWidth - 1 && j < nftWidth - 1) {
                let randomStar = getRandomInt(150);
                if (array[i][j] == '#000000' && randomStar == 1 && array[i + 1][j] == '#000000' && array[i + 1][j + 1] == '#000000' && array[i + 1][j - 1] == '#000000' && array[i - 1][j] == '#000000' && array[i - 1][j + 1] == '#000000' && array[i - 1][j - 1] == '#000000' && array[i][j - 1] == '#000000' && array[i][j + 1] == '#000000') {
                    await updatePixel(array, i, j, '#ffffff');
                }
            }
        }
    }
    await updateLastPixel(array);
}

function renderArray(array) {
    for (let i = 0; i < array.length; i++) {
        $('#border').append('<div id="row-' + i + '"></div>');
        for (let j = 0; j < array[i].length; j++) {
            $('#row-' + i).append('<div class="px" style="background:' + array[i][j] + '"></div>');
        }
        $('#border').append('</div>');
    }
}

function createCanvas(planetDetails) {
    var myFont = new FontFace('myFont', 'url(font.otf)');

    myFont.load().then(function (font) {
        document.fonts.add(font);  // Ajoute la police au document
        return html2canvas(document.querySelector("#img"), {
            useCORS: true,
            scale: 2,
            backgroundColor: null,
        });
    }).then(canvas => {
        canvas.setAttribute("id", "img-canvas");
        $('#canevas').append(canvas);
        addTextToCanvas(canvas, planetDetails);
        enableDownloadBtn();
    });
}


function addTextToCanvas(canvas, planetDetails) {
    var myFont = new FontFace('myFont', 'url(font.otf)');

    myFont.load().then(function (font) {
        document.fonts.add(font);

        var ctx = canvas.getContext('2d');
        ctx.font = pxTextL + 'px myFont';
        ctx.textAlign = "left";
        ctx.fillStyle = "white";

        var imgElement = document.querySelector("#img");
        var rect = imgElement.getBoundingClientRect(); // Coordonnées de l'élément sur la page

        var offsetX = rect.left; // Décalage horizontal
        var offsetY = rect.bottom;  // Décalage vertical

        ctx.fillText(planetDetails.namePlanet, offsetX + pxRender*2, offsetY - pxRender*2);
        ctx.font = pxTextS + 'px myFont';
        ctx.fillText(planetDetails.systemPlanet, offsetX + pxRender*2, offsetY - pxRender*3 - 14);
    });
}


$(document).ready(function () {
    generatePlanet();
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomIntWithMin(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function disableDownloadBtn(namePlanet){
    $("#download, #reload").prop("disabled", true);
    $("#download, #reload").attr("data-name", namePlanet);
}

function enableDownloadBtn(){
    $("#download, #reload").prop("disabled", false);
}

document.getElementById("download").addEventListener("click", function () {
    const canvas = document.getElementById("img-canvas");
    const image = canvas.toDataURL("image/png"); // Convertit le canvas en image PNG
    const name = this.getAttribute('data-name');

    const link = document.createElement("a");
    link.href = image;
    link.download = name + ".png"; // Nom du fichier à télécharger
    link.click();
});

document.getElementById("reload").addEventListener("click", function () {
    $('#border').html('');
    $('#planet-name').text('');
    $('#system-name').text('');
    $("#reload > i").addClass("rotate-icon rotate");

    document.getElementById("img-canvas").remove();
    generatePlanet();
});