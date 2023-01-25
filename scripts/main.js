// add more frames here as they become availible
const frames = [
    "./frames/flat-1.png",
    "./frames/flat-2.png",
    "./frames/square-round-1.png",
    "./frames/square-round-2.png",
    "./frames/square-round-3.png",
    "./frames/square-round-4.png",
    "./frames/square-round-grad-1.png",
    "./frames/square-round-grad-2.png",
    "./frames/square-round-grad-3.png",
    "./frames/square-round-grad-4.png",
    "./frames/big-g.png",
    "./frames/circle-3.png",
    "./frames/circle-1.png",
    "./frames/circle-2.png",
    "./frames/circle-4.png",
    "./frames/circle-5.png"
];

const frameNames = [
	'guild-1',
	'guild-2',
	'slack-1',
	'slack-2',
	'slack-3',
	'slack-4',
	'slack-gradient-1',
	'slack-gradient-2',
	'slack-gradient-3',
	'slack-gradient-4',
	'slack-g-overlay',
	'twitter-g-overlay',
	'twitter-1',
	'twitter-2',
	'twitter-gradient-1',
	'twitter-gradient-2',
]

let images = []
const downButton = document.getElementById("down-button")

const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });

function render(profilePic, framePic) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // the dimension of the resulting image should
    // be somewhere between 512px and 1024px
    const dimension = Math.min(
        Math.max(profilePic.width, profilePic.height, 512),
        1024
    );

    // set the the canvas to the resulting image size (a square)
    canvas.width = dimension;
    canvas.height = dimension;

    // if the image is in landscape mode (aspectRatio > 1) it will overflow horizontally,
    // if it's in portrait mode it will overflow vertically.
    const aspectRatio = profilePic.width / profilePic.height;
    const [profilePicW, profilePicH] =
    aspectRatio > 1 ? [dimension * aspectRatio, dimension] // scale width outside dimension
        :
        [dimension, dimension / aspectRatio]; // scale height outside dimension

    // draw the picture at the center of the canvas
    const x = (dimension - profilePicW) / 2;
    const y = (dimension - profilePicH) / 2;
    context.drawImage(profilePic, x, y, profilePicW, profilePicH);

    // draw frame (if there is one)
    if (framePic) {
        context.drawImage(framePic, 0, 0, dimension, dimension);
    }

    const imgEl = document.createElement("img");
    imgEl.src = canvas.toDataURL("image/png");

    images.push(imgEl)

    return imgEl;
}

const framePromises = frames.map(loadImage);

const uploadBtn = document.getElementById("inp-button");

uploadBtn.addEventListener('click', () => {
    document.getElementById("inp").click()
})

document.getElementById("inp").onchange = async({
    target
}) => {
    try {
        const frameEl = document.getElementById("frames");
        const uploadedFrameEl = document.getElementById('uploaded-frame');

        frameEl.innerHTML = "Loading...";
        uploadedFrameEl.innerHTML = '';

        const profilePicUrl = URL.createObjectURL(target.files[0]);
        const profilePic = await loadImage(profilePicUrl);
                        
        uploadedFrameEl.appendChild(render(profilePic));
        const framePics = await Promise.all(framePromises);

        frameEl.innerHTML = "";
        frameEl.classList.remove('default-frames');
		images = []

        // render each frame over the profile pic
        framePics.forEach((framePic) => {
            const imgEl = render(profilePic, framePic);
            frameEl.appendChild(imgEl);
        });
        uploadBtn.innerText = "Change photo";
     	downButton.style.opacity = 1;
     	downButton.style.display = "block";
    } catch (err) {
        console.log(err);
    }
};

downButton.addEventListener('click', () => {
	var zip = new JSZip();
	images.forEach((img, i) => {
		const imageData = img.currentSrc.split(',')

		zip.file(`${frameNames[i]}.png`, imageData[1], {base64: true});
	})

	zip.generateAsync({type:"blob"})
	.then(function(content) {
	    saveAs(content, "guild-avatars.zip");
	});
})
