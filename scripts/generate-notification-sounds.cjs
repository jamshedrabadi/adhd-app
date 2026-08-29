const fs = require("fs");
const path = require("path");

const sampleRate = 22050;
const outputDirectory = path.join(__dirname, "..", "assets", "sounds");

const clamp = (value) => Math.max(-1, Math.min(1, value));

const writeWave = (name, durationSeconds, sampleAt) => {
	const sampleCount = Math.floor(sampleRate * durationSeconds);
	const dataSize = sampleCount * 2;
	const buffer = Buffer.alloc(44 + dataSize);

	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVEfmt ", 8);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(1, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(sampleRate * 2, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write("data", 36);
	buffer.writeUInt32LE(dataSize, 40);

	for (let index = 0; index < sampleCount; index += 1) {
		const time = index / sampleRate;
		buffer.writeInt16LE(Math.round(clamp(sampleAt(time)) * 32767), 44 + index * 2);
	}

	fs.writeFileSync(path.join(outputDirectory, `${name}.wav`), buffer);
};

fs.mkdirSync(outputDirectory, { recursive: true });

writeWave("attention_bells", 2.35, (time) => {
	const bellStarts = [0, 0.64, 1.28];

	return bellStarts.reduce((signal, start) => {
		const elapsed = time - start;
		if (elapsed < 0) {
			return signal;
		}

		const envelope = Math.exp(-3.1 * elapsed);
		const bell = 0.23 * Math.sin(2 * Math.PI * 659.25 * elapsed)
			+ 0.14 * Math.sin(2 * Math.PI * 987.77 * elapsed)
			+ 0.08 * Math.sin(2 * Math.PI * 1318.51 * elapsed);
		return signal + envelope * bell;
	}, 0);
});
