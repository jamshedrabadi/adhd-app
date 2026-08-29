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

writeWave("soft-chime", 0.9, (time) => {
	const envelope = Math.exp(-3.4 * time);
	return envelope * (0.18 * Math.sin(2 * Math.PI * 660 * time) + 0.1 * Math.sin(2 * Math.PI * 990 * time));
});

writeWave("bell", 1.15, (time) => {
	const envelope = Math.exp(-2.7 * time);
	return envelope * (0.17 * Math.sin(2 * Math.PI * 523.25 * time) + 0.11 * Math.sin(2 * Math.PI * 1046.5 * time) + 0.06 * Math.sin(2 * Math.PI * 1569.75 * time));
});

writeWave("digital", 0.42, (time) => {
	const envelope = Math.exp(-6.5 * time);
	return envelope * 0.18 * Math.sign(Math.sin(2 * Math.PI * 880 * time));
});

writeWave("knock", 0.38, (time) => {
	const first = Math.exp(-18 * time) * Math.sin(2 * Math.PI * 135 * time);
	const secondTime = Math.max(0, time - 0.16);
	const second = Math.exp(-20 * secondTime) * Math.sin(2 * Math.PI * 145 * secondTime);
	return 0.24 * (first + second);
});
