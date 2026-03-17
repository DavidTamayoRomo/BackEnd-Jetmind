const path = require('path');
const fs = require('fs');
const { v4 } = require('uuid');
const { actualizarImagen } = require('../../../utils');
const { s3 } = require('../../../helper/multer');
const Contrato = require('../contrato/model');
const Marca = require('../marca/model');

const MAX_UPLOAD_SIZE = Number(process.env.MAX_UPLOAD_SIZE || 5 * 1024 * 1024);
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
const VALID_TABLES = ['personas', 'representantes', 'estudiantes', 'empresas', 'sucursales', 'marcas', 'contratos', 'facturas'];
const { BUCKET_NAME } = process.env;

const ensureUploadDirectory = (tabla) => {
  const uploadDir = path.resolve(__dirname, `../../../uploads/${tabla}`);
  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
};

const validateImageFile = (file) => {
  const fileName = file.name || '';
  const extension = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return 'Formato no valido, solo se admite png, jpg, jpeg, gif';
  }

  if (file.mimetype && !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return 'Tipo MIME no permitido';
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return `El archivo excede el tamaño máximo permitido (${MAX_UPLOAD_SIZE} bytes)`;
  }

  return null;
};

const handleLocalUpload = async ({ tabla, atributo, id, files }) => {
  if (!VALID_TABLES.includes(tabla)) {
    return {
      status: 400,
      body: { success: false, data: 'No se encontraron coincidencias con las tablas existentes' },
    };
  }

  if (!files || !files.imagen) {
    return {
      status: 400,
      body: { success: false, data: 'No hay ningun archivo' },
    };
  }

  const uploadDir = ensureUploadDirectory(tabla);
  const normalizedFiles = Array.isArray(files.imagen) ? files.imagen : [files.imagen];

  for (const file of normalizedFiles) {
    const validationError = validateImageFile(file);
    if (validationError) {
      return {
        status: 400,
        body: { success: false, data: validationError },
      };
    }
  }

  const nombresArchivo = [];
  for (const file of normalizedFiles) {
    const extensionArchivo = file.name.split('.').pop().toLowerCase();
    const nombreArchivo = `${v4()}.${extensionArchivo}`;
    const destino = path.join(uploadDir, nombreArchivo);
    await file.mv(destino);
    nombresArchivo.push(nombreArchivo);
  }

  const payload = normalizedFiles.length > 1 ? nombresArchivo : nombresArchivo[0];
  await actualizarImagen(tabla, atributo, id, payload);

  return {
    status: 200,
    body: {
      success: true,
      data: payload,
    },
  };
};

const getLocalUploadPath = (tabla, imagen) => {
  const pathImg = path.join(__dirname, `../../../uploads/${tabla}/${imagen}`);
  if (fs.existsSync(pathImg)) {
    return pathImg;
  }
  return path.join(__dirname, `../../../uploads/noIMG.png`);
};

const registerDigitalOceanUpload = async (body, files) => {
  const { idContrato } = body;
  const contrato = await Contrato.findById(idContrato);
  if (contrato) {
    contrato.voucher.push(files[0].key);
    await contrato.save();
    return { success: true };
  }

  const marca = await Marca.findById(idContrato);
  if (marca) {
    marca.logo = files[0].key;
    await marca.save();
  }

  return { success: true };
};

const fetchDigitalOceanFile = async (nombreImagen) => {
  const data = await s3.getObject({ Bucket: BUCKET_NAME, Key: nombreImagen }).promise();
  const outputDir = path.resolve(path.join(__dirname, '../../../uploads/prueba'));
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.resolve(path.join(outputDir, nombreImagen));
  fs.writeFileSync(outputPath, data.Body);
  return outputPath;
};

module.exports = {
  handleLocalUpload,
  getLocalUploadPath,
  registerDigitalOceanUpload,
  fetchDigitalOceanFile,
};
