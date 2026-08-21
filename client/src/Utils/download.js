/**
 * Triggers a browser download for a file.
 * @param {string} fileData - The URL or base64 data of the file.
 * @param {string} fileName - The name of the file to save as.
 */
export const downloadFile = async (fileData, fileName) => {
    try {
        const res = await fetch(fileData);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading file:", error);
        // Fallback to direct link download in case of CORS or other issues
        const a = document.createElement("a");
        a.href = fileData;
        a.download = fileName || "download";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
