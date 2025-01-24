/*global chrome*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FETCH_IMAGE') {
    fetch(request.url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => sendResponse({ data: reader.result });
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
        sendResponse({ error: error.message });
      });
    return true; // Will respond asynchronously
  }
}); 