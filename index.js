const Canvas = require("canvas");
const extractFrames = require("gif-extract-frames");
const GIFEncoder = require("gifencoder");
const fs = require("fs");
/**
 * Returns a new buffer with the bonk gif.
 * @param {string} image A path to a file. A URL can be provided instead.
 * @param {string} out A path to the output gif.
 * @returns {Buffer} Bonk gif
 */
const bonk = async (image, out) => {
    const LOCATIONS = [
        [0, 66],
        [0, 67],
        [-1, 68],
        [1, 67],
        [0, 66],
    ];

    try {
        const bonkImg = await Canvas.loadImage(image);
        const encoder = new GIFEncoder(115, 115);
        const frames = await extractFrames({
            input: "./assets/bonk.gif",
            output: "./assets/bonk-%d.png",
        });

        encoder.createReadStream().pipe(fs.createWriteStream(out));

        encoder.start();
        encoder.setRepeat(0);
        encoder.setFrameRate(18);
        encoder.setQuality(10);

        const canvas = Canvas.createCanvas(115, 115);
        const ctx = canvas.getContext("2d");
        const amount = frames.shape[0];

        for (let i = 0; i < amount; i++) {
            const frame = await Canvas.loadImage(`./assets/bonk-${i}.png`);
            ctx.drawImage(frame, 0, 0, 115, 115);
            ctx.drawImage(bonkImg, ...LOCATIONS[i], 50, 50);
            encoder.addFrame(ctx);

            fs.unlinkSync(`./assets/bonk-${i}.png`);
        }

        encoder.finish();

        return encoder.out.getData();
    } catch (e) {
        throw (e)
    }
}

module.exports = bonk;