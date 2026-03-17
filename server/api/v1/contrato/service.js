const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const PdfPrinter = require('pdfmake');
const { v4 } = require('uuid');

const Model = require('./model');
const Persona = require('../persona/model');
const Representante = require('../representante/model');
const Estudiante = require('../estudiante/model');
const Programa = require('../programa/model');
const Ciudad = require('../ciudad/model');
const envioEmail = require('../../../email');
const config = require('../../../config');

const fonts = {
  Roboto: {
    normal: Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
  },
};
const printer = new PdfPrinter(fonts);

const dbPath = path.join(__dirname, '../../../uploads/contratos/');
const { frontendUrl = '' } = config.app || {};
const DEFAULT_FRONTEND_URL = frontendUrl || 'http://localhost:4200';
const APPROVER_ROLE_IDS = ['617c24f99f60c044346e3ffa', '617c25009f60c044346e3ffc'];

const ensureDirectory = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const safeValue = (value, fallback = '') => (value === undefined || value === null ? fallback : value);

const buildContractCode = async (userId) => {
  const persona = await Persona.findById(userId).exec();
  if (!persona || !persona.idCiudad || !persona.idCiudad[0]) {
    const totalContratos = await Model.countDocuments();
    return `C-${totalContratos + 9000}`;
  }

  const ciudad = await Ciudad.findById(persona.idCiudad[0]).exec();
  const totalContratos = await Model.countDocuments();
  const prefix = ciudad && ciudad.nombre ? ciudad.nombre.charAt(0).toUpperCase() : 'C';
  return `${prefix}-${totalContratos + 9000}`;
};

const calcularEdad = (fecha) => {
  if (!fecha) return '';
  const hoy = new Date();
  const cumpleanos = new Date(fecha);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad -= 1;
  }

  return edad;
};

const buildPeeaLink = (contractId) => `${DEFAULT_FRONTEND_URL.replace(/\/$/, '')}/peea-17-ch-uk/nuevo/${contractId}`;

const loadContractRelations = async (idContrato) => {
  const contrato = await Model.findById(idContrato)
    .populate('addedUser', 'nombresApellidos email')
    .populate('idRepresentante')
    .exec();

  if (!contrato) {
    throw new Error('Contrato no encontrado');
  }

  const representante = contrato.idRepresentante || await Representante.findById(contrato.idRepresentante).exec();
  const estudiantes = await Estudiante.find({ idRepresentante: contrato.idRepresentante }).exec();

  return { contrato, representante, estudiantes };
};

const buildStudentsRows = async (estudiantes) => {
  const rows = [];

  for (const estudiante of estudiantes) {
    const programas = await Programa.find({ idEstudiante: estudiante._id })
      .populate('idNombrePrograma')
      .populate('idMarca')
      .exec();

    const nombresPrograma = [];
    const nombresMarca = [];

    programas.forEach((programa) => {
      (programa.idNombrePrograma || []).forEach((item) => {
        if (item && item.nombre) {
          nombresPrograma.push(item.nombre);
        }
      });

      (programa.idMarca || []).forEach((marca) => {
        if (marca && marca.nombre) {
          nombresMarca.push(marca.nombre);
        }
      });
    });

    rows.push([
      safeValue(estudiante.nombresApellidos),
      safeValue(estudiante.cedula),
      safeValue(calcularEdad(estudiante.fechaNacimiento)),
      [...new Set(nombresMarca)].join(', '),
      [...new Set(nombresPrograma)].join(', '),
    ]);
  }

  return rows;
};

const createContractPdf = async (idContrato) => {
  ensureDirectory(dbPath);
  const { contrato, representante, estudiantes } = await loadContractRelations(idContrato);
  const studentRows = await buildStudentsRows(estudiantes);

  const matricula = contrato.valorMatricula || 0;
  const cuotas = contrato.numeroCuotas || 0;
  const valorMensual = cuotas > 0 ? Math.max((contrato.valorTotal - matricula) / cuotas, 0) : 0;
  const outputPath = path.resolve(process.cwd(), `contratoDigital${contrato.codigo}.pdf`);

  const pdfDefinition = {
    content: [
      { text: `Contrato Digital ${safeValue(contrato.codigo)}`, style: 'header' },
      { text: `Fecha: ${safeValue(contrato.fecha)}` },
      { text: `Estado: ${safeValue(contrato.estado, 'Pendiente')}` },
      { text: `\nDATOS TITULAR DEL CONTRATO`, style: 'section' },
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            ['Nombre', safeValue(representante && representante.nombresApellidos)],
            ['Cédula', safeValue(representante && representante.cedula)],
            ['Teléfono', safeValue(representante && representante.telefono)],
            ['Email', safeValue(representante && representante.email)],
            ['Dirección', safeValue(representante && representante.direccion)],
          ],
        },
      },
      { text: `\nESTUDIANTES`, style: 'section' },
      {
        table: {
          headerRows: 1,
          widths: ['28%', '18%', '10%', '18%', '26%'],
          body: [
            ['Estudiante', 'Cédula', 'Edad', 'Marca', 'Programas'],
            ...studentRows,
          ],
        },
      },
      { text: `\nDETALLE ECONÓMICO`, style: 'section' },
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            ['Forma de pago', safeValue(contrato.formaPago)],
            ['Valor total', `$ ${safeValue(contrato.valorTotal, 0)}`],
            ['Matrícula', `$ ${matricula}`],
            ['Cuotas', safeValue(cuotas, 0)],
            ['Valor mensual', `$ ${valorMensual}`],
          ],
        },
      },
      { text: `\nOBSERVACIONES`, style: 'section' },
      { text: safeValue(contrato.comentario, 'Sin observaciones') },
      { text: `\nAsesor comercial: ${safeValue(contrato.addedUser && contrato.addedUser.nombresApellidos)}` },
      { text: '\nDocumento generado automáticamente por el sistema.' },
    ],
    styles: {
      header: { fontSize: 18, bold: true },
      section: { fontSize: 13, bold: true },
    },
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
    },
  };

  await new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(pdfDefinition);
    const stream = fs.createWriteStream(outputPath);
    pdfDoc.pipe(stream);
    pdfDoc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return { outputPath, contrato, representante, estudiantes };
};

const sendContractPdfByEmail = async (idContrato) => {
  const { outputPath, contrato, representante } = await createContractPdf(idContrato);

  if (!representante || !representante.email) {
    return { outputPath, sent: false };
  }

  await envioEmail.transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: representante.email,
    subject: `CONTRATO DIGITAL - ${contrato.codigo}`,
    attachments: [
      {
        filename: path.basename(outputPath),
        path: outputPath,
        contentType: 'application/pdf',
      },
    ],
  });

  return { outputPath, sent: true };
};

const notifyApprovers = async (programa, estudianteNombre) => {
  if (!programa) return;

  const personas = await Persona.find({
    tipo: { $in: APPROVER_ROLE_IDS.map((id) => mongoose.Types.ObjectId(id)) },
    idMarca: { $in: programa.idMarca || [] },
    idCiudad: { $in: programa.idCiudad || [] },
    idSucursal: { $in: programa.idSucursal || [] },
  }).exec();

  for (const persona of personas) {
    if (!persona.email) continue;
    await envioEmail.transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: persona.email,
      subject: `Contrato aprobado para ${estudianteNombre}`,
      text: `Se aprobó un contrato relacionado con ${estudianteNombre}.`,
    }).catch((error) => console.log(error));
  }
};

const processApprovedContract = async (contrato) => {
  const representante = await Representante.findById(contrato.idRepresentante).exec();
  if (!representante) return;

  representante.estado = 'Activo';
  await representante.save();

  if (representante.email) {
    await envioEmail.transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: representante.email,
      subject: `Contrato aprobado ${safeValue(contrato.codigo)}`,
      text: `Su contrato ${safeValue(contrato.codigo)} ha sido aprobado.`,
    }).catch((error) => console.log(error));
  }

  const estudiantes = await Estudiante.find({ idRepresentante: representante._id }).exec();
  for (const estudiante of estudiantes) {
    const programa = await Programa.findOne({ idEstudiante: estudiante._id }).exec();

    if (representante.email) {
      await envioEmail.transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: representante.email,
        subject: `PEEA ${safeValue(estudiante.nombresApellidos)}`,
        html: `<h1>Para llenar PEEA debe ingresar al siguiente link</h1><a href="${buildPeeaLink(contrato._id)}">Clic aqui para Llenar PEEA</a>`,
      }).catch((error) => console.log(error));
    }

    await notifyApprovers(programa, estudiante.nombresApellidos);
  }
};

const updateRepresentativeAndStudentsStatus = async (representanteId, estado) => {
  const representante = await Representante.findById(representanteId).exec();
  if (!representante) return;

  representante.estado = estado;
  await representante.save();

  const estudiantes = await Estudiante.find({ idRepresentante: representante._id }).exec();
  for (const estudiante of estudiantes) {
    estudiante.estado = estado;
    await estudiante.save();
  }
};

const processContractStatusChange = async (contrato) => {
  if (contrato.estado === 'Aprobado') {
    await processApprovedContract(contrato);
    return;
  }

  if (contrato.estado === 'Rechazado' || contrato.estado === 'Espera') {
    await updateRepresentativeAndStudentsStatus(contrato.idRepresentante, contrato.estado);
  }
};

const extractBase64Payload = (item) => {
  const value = String(item || '');
  if (!value) return null;
  const match = value.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  return match ? match[1] : value;
};

const persistVouchers = async (voucherList = [], append = false, doc, modifiedUser) => {
  ensureDirectory(dbPath);
  const filesToSave = [];

  for (const item of voucherList || []) {
    const base64Payload = extractBase64Payload(item);
    if (!base64Payload) continue;

    const fileName = `${v4()}.jpg`;
    fs.writeFileSync(path.join(dbPath, fileName), base64Payload, 'base64');
    filesToSave.push(fileName);
  }

  doc.modifiedUser = modifiedUser;
  doc.voucher = append ? [...(doc.voucher || []), ...filesToSave] : filesToSave;
  return doc.save();
};

module.exports = {
  buildContractCode,
  sendContractPdfByEmail,
  processContractStatusChange,
  persistVouchers,
};
