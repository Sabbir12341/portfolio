const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

(async () => {
    try {
        const filePath = path.join(__dirname, 'test_upload.png');
        const img = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
        fs.writeFileSync(filePath, img);
        const form = new FormData();
        form.append('profileImage', fs.createReadStream(filePath));

        const response = await fetch('http://localhost:3010/api/upload/profile-image', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });

        console.log('status', response.status);
        const text = await response.text();
        console.log('body', text);
    } catch (error) {
        console.error('error', error);
    } finally {
        try { fs.unlinkSync(path.join(__dirname, 'test_upload.png')); } catch (e) {}
    }
})();