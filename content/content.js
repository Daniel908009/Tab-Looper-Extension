chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "show-notification"){
        showToast(request.message);
    }
});

let currentToast = null;

function showToast(message) {
    if (currentToast) {
        document.body.removeChild(currentToast);
        currentToast = null;
    }
    const toast = document.createElement('div');
    currentToast = toast;
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '20px';
    toast.style.padding = '10px 20px';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    toast.style.color = 'white';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '9999';
    
    const parent = document.body || document.documentElement;
    parent.appendChild(toast);
    
    setTimeout(() => {
        if (currentToast === toast) {
            document.body.removeChild(toast);
            currentToast = null;
        }
    }, 3000);
}