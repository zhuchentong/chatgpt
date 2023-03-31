import domToImage from "dom-to-image";

export async function exportToPng(element: HTMLDivElement) {
  domToImage
    .toPng(element, {
      style: {
        backgroundColor: "#fff",
        borderRadius: "10px",
      },
      quality: 1,
    })
    .then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "chat-export.png";
      link.href = dataUrl;
      link.click();
    });
}

export function useExport() {
  return {
    exportToPng,
  };
}
