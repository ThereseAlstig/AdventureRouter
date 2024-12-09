import multer from 'multer';

const storage = multer.memoryStorage(); // Spara filen i RAM för vidare bearbetning
const upload = multer({ storage });

export default upload;
