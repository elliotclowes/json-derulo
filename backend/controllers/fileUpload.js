require('dotenv').config();
const { db, bucket } = require('../database/firebase');
const pathModule = require('path');

async function fileUpload({ path, type }) {
    try {
        const filename = pathModule.basename(path);
        const destination = `${type}/${filename}`; // Modify the destination based on the type

        const [file] = await bucket.upload(path, { destination });

        // Make the file publicly accessible.
        await file.makePublic();

        // Get the public URL of the file
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        return publicUrl;

    } catch (error) {
        console.error(`Error uploading ${type} file:`, error);
        throw error; // Propagate the error up so callers can handle it if needed
    }
}

module.exports = { fileUpload };
