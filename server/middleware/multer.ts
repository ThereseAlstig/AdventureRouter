import multer from "multer";

// Konfigurera multer för att lagra filer i minnet
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB
});

export default upload;