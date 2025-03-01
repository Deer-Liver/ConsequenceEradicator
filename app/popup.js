document.addEventListener('DOMContentLoaded', function () {
    const scanButton = document.getElementById('scanButton');
    const scanResults = document.getElementById('scanResults');

    scanButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: scanContent
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const { images, videos, text } = results[0].result;
                    
                    // Output to popup UI
                    scanResults.innerHTML = `
                        <p>Found ${images} images, ${videos} videos, and extracted text from posts.</p>
                    `;

                    // Output to console
                    console.log("Scan Results:");
                    console.log(`Images: ${images}`);
                    console.log(`Videos: ${videos}`);
                    console.log("Extracted Text:", text);
                } else {
                    scanResults.innerHTML = '<p>No content found.</p>';
                    console.log("No content found.");
                }
            });
        });
    });
});

function scanContent() {
    const images = document.querySelectorAll('img').length;
    const videos = document.querySelectorAll('video').length;
    const text = document.body.innerText.substring(0, 1000); 

    return { images, videos, text };
}
