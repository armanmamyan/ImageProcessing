const canvas = document.querySelector('#imageCanvas');
const sourceImage = document.querySelector('.sourceImage');
const ctx = canvas.getContext('2d');
const testBtn = document.querySelector('#test');
const buttons = document.querySelectorAll('.filter-buttons');
const inputs = document.querySelectorAll('.filter--control-input');
const paint = document.querySelector('#paint');

const drawImage = (image) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.drawImage(image, 0, 0,  canvas.width, canvas.height);
}

const redrawImage = () => {
    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
  }

const truncateColor = (value) => {
    if(value < 0){
        value = 0
    }else if(value > 255){
        value = 255;
    }

    return value;
}

const colorInversion = (unit8Data) =>{
    for (let index = 0; index < unit8Data.length; index+= 4) {
        unit8Data[index] = unit8Data[index] ^ 255;
        unit8Data[index + 1] = unit8Data[index + 1] ^ 255;
        unit8Data[index + 2] = unit8Data[index + 2] ^ 255;
    }
}

const staticGrayScale = (data) => {
    for (let index = 0; index < data.length; index+= 4) {
        //const brightness = 0.34 * data[index] + 0.5 * data[index + 1] + 0.16 * data[index + 2]; // Static GrayScale Formula 1
        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
        data[index] = brightness;
        data[index + 1] = brightness;
        data[index + 2] = brightness;
    }
}


const applyBrightness = (data, brightnessValue) => {
    for (let index = 0; index < data.length; index+= 4) {
        data[index] += 255 * (brightnessValue / 100);
        data[index + 1] += 255 * (brightnessValue / 100);
        data[index + 2] += 255 * (brightnessValue / 100);
    }
}

const applyContrast = (data, contrast) => {
    const factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
    for (let index = 0; index < data.length; index+= 4) {
        data[index] = truncateColor(factor * (data[index] - 128.0) + 128.0);
        data[index + 1] = truncateColor(factor * (data[index + 1] - 128.0) + 128.0);
        data[index + 2] = truncateColor(factor * (data[index + 2] - 128.0) + 128.0);;
    }
}

const staticSepia = (data) => {
    for (let index = 0; index < data.length; index+= 4) {
        let red = data[index], green = data[index + 1], blue = data[index + 2];
        data[index] =  Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);;
        data[index + 1] =  Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
        data[index + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
    }
}

const sepia = (data, value) => {
    for (let index = 0; index < data.length; index+= 4) {
        data[index] = 255 - value ;
        data[index + 1] =  255 - value;
        data[index + 2] = 255 - value;
    }
}

const saturation = (data,value) => {
    let max = (value < 0) ? 255 : 128;

    for (let index = 0; index < data.length; index+= 4) {
        let r = data[index] & 0xFF;
        let g = (data[index] >> 8) & 0xFF;
        let b = (data[index] >> 16) & 0xFF;
        let gray = (r * 0.2126 + g * 0.7152 + b * 0.0722);

        r += (r - gray) * value / max;
        g += (g - gray) * value / max;
        b += (b - gray) * value / max;

        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        data[index] =  (data[index] & 0xFF000000) | (b << 16) | (g << 8) | r;
    }
}


buttons.forEach(btn =>{
    btn.addEventListener('click', e => {
        const target = e.currentTarget;
        let imageData;
        switch (target.name) {
            case 'colorInversion':
                // redrawImage();
                imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
                colorInversion(imageData.data);
                ctx.putImageData(imageData,0,0);

                // ctx.filter = `invert(${target.value}%)`;
                break;
            case 'grayscale':
                // redrawImage();
                imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
                staticGrayScale(imageData.data);
                ctx.putImageData(imageData,0,0);

                // ctx.filter = `grayscale(${target.value}%)`;
                break;
            case 'sepia':
                // redrawImage();
                imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
                staticSepia(imageData.data);
                ctx.putImageData(imageData,0,0);
            
                // ctx.filter = `grayscale(${target.value}%)`;
                 break;
            default:
                break;
        }

    });
});
inputs.forEach(btn =>{
    btn.addEventListener('change', e => {
        const target = e.currentTarget;
        let imageData;

        switch (target.name) {
            case 'contrast':
                redrawImage();
                imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
                applyContrast(imageData.data, parseInt(target.value, 10));
                ctx.putImageData(imageData,0,0);

                // ctx.filter = `contrast(${target.value}%)`;
                break;
            case 'brightness':
                redrawImage();
                imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
                applyBrightness(imageData.data, parseInt(target.value, 10));
                ctx.putImageData(imageData,0,0);

                // ctx.filter = `brightness(${target.value}%)`;
                break;
            case 'saturation':
                redrawImage();
                imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
                saturation(imageData.data, parseInt(target.value, 10));
                ctx.putImageData(imageData,0,0);

                // ctx.filter = `saturation(${target.value}%)`;
                break;
            default:
                break;
        }

    });
})

paint.addEventListener('click', () => drawImage(sourceImage));