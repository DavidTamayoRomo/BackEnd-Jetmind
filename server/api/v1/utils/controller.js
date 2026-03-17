const { response } = require('express');
const path = require('path');
const fs = require('fs')

const { upload, s3 } = require("../../../helper/multer");
const {
  handleLocalUpload,
  getLocalUploadPath,
  registerDigitalOceanUpload,
  fetchDigitalOceanFile,
} = require('./upload.service');
const {
  busquedaGeneral: busquedaGeneralService,
  busquedaEspecifica: busquedaEspecificaService,
} = require('./search.service');

exports.busquedaGeneral = async (req, res = response, next) => {
  try {
    const data = await busquedaGeneralService(req.params.busqueda);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(new Error(error));
  }
}

exports.busquedaEspecifica = async (req, res = response, next) => {
  try {
    const result = await busquedaEspecificaService({
      tabla: req.params.tabla,
      busqueda: req.params.busqueda,
      campos: req.params.campos,
      decoded: req.decoded || {},
    });

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    if (error.message === 'SEARCH_TABLE_NOT_SUPPORTED') {
      return res.status(400).json({
        success: false,
        data: 'No se encontraron coincidencias con las tablas existentes'
      });
    }

    return next(new Error(error));
  }
};

exports.fileUploadVouchers = (req, res) => {
  const tabla = req.params.tabla; //contrato
  const atributo = req.params.atributo; //voucher
  const id = req.params.id; //id del contrato
  const imagen64 = req.params.imagen64;

  console.log('imagen64', imagen64);
  console.log('id', id);

  

}

exports.fileUpload = async (req, res) => {
  try {
    const result = await handleLocalUpload({
      tabla: req.params.tabla,
      atributo: req.params.atributo,
      id: req.params.id,
      files: req.files,
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al mover la imagen',
      error: error.message,
    });
  }
}

exports.returnfileUpload = (req, res) => {
  const pathImg = getLocalUploadPath(req.params.tabla, req.params.imagen);
  res.sendFile(pathImg);
}

exports.fileUploadDigitalOcean = async (req, res) => {
  const result = await registerDigitalOceanUpload(req.body, req.files);
  res.json(result);
}
exports.getFilesDigitalOcean = async (req, res) => {
  const filePath = await fetchDigitalOceanFile(req.params.nombreImagen);
  res.sendFile(filePath);

}
