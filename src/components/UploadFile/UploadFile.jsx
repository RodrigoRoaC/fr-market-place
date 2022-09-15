import React, { useContext, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Tooltip } from 'primereact/tooltip';
import { UserContext } from '../../context/UserContext';
import { fileToBuffer } from '../../utils/converter';
import { IndicatorService } from '../../services/Indicator/IndicatorService';

export const UploadFile = () => {
  const { user } = useContext(UserContext);
  const toast = useRef(null);

  const onUpload = async (event) => {
    const file = event.files[0];
    const result = await fileToBuffer(file);
    const workBook = XLSX.read(result, { type: 'array' });
    const wsname = workBook.SheetNames[0];
    const ws = workBook.Sheets[wsname];
    const workBookToJSON = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const indicatorService = new IndicatorService();
    const { error } = await indicatorService.upload({ file: workBookToJSON, cod_usuario: user.cod_usuario });
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Upload error', detail: 'Error uploading file', life: 3000 });
      return;
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Upload successfully', life: 3000 });
  };

  return (
    <div>
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <div className="card">
        <h5>Cargar indicadores</h5>
        <FileUpload
          name="indicator"
          customUpload
          uploadHandler={onUpload}
          accept=".xlsx"
          maxFileSize={1000000}
          emptyTemplate={
            <p className="m-0">Arrastrar y soltar el archivo aquí.</p>
          }
        />
      </div>
    </div>
  );
};
