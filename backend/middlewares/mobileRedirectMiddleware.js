const path = require("path");

function mobileRedirect(desktopFile, mobileFile) {
  return (req, res) => {
    const userAgent = req.headers["user-agent"] || "";
    const isMobile = /mobile|android|iphone|ipad|touch|webos|blackberry|phone/i.test(userAgent);

    // 
    const finalPath = path.join(
      process.cwd(), //USAMOS PROCESS.CWD PARA OBTENER LA RUTA ACTUAL DEL PROYECTO (RAIZ DEL PROYECTO)
      "frontend",
      isMobile ? mobileFile : desktopFile
    );

    res.sendFile(finalPath);
  };
}

module.exports = mobileRedirect;
