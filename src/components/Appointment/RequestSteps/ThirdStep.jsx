import React, { useState } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { UbigeoService } from '../../../services/Ubigeo/UbigeoService';

const ThirdStep = ({
  toast,
  currentStep,
  setActiveIndex,
  form,
  setForm,
  departamentos,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [filteredDep, setFilteredDep] = useState(null);
  const [selectedDep, setSelectedDep] = useState(null);
  
  const [filteredProv, setFilteredProv] = useState(null);
  const [provincias, setProvincias] = useState(null);
  const [selectedProv, setSelectedProv] = useState(null);
  
  const [filteredDis, setFilteredDis] = useState(null);
  const [distritos, setDistritos] = useState(null);
  const [selectedDis, setSelectedDis] = useState(null);

  const tipoDocumento = [
    {
      label: 'DNI',
      value: 1
    },
    {
      label: 'RUC',
      value: 6
    },
  ];

  const previousButton = () => {
    setActiveIndex(currentStep - 1);
  }

  const nextButton = () => {
    setSubmitted(true);
    setActiveIndex(currentStep + 1);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _form = {...form};
    _form[`${name}`] = val;

    setForm(_form);
  }

  const setProvinciaData = async (ubigeoDep) => {
    const ubigeoService = new UbigeoService();
    const { error, data } = await ubigeoService.getProvincias(ubigeoDep);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Provincias list Error', detail: 'Get provincias failed', life: 3000 });
      return;
    }

    setProvincias(data);
  }

  const setDistritoData = async (ubigeoDep, ubigeoProv) => {
    const ubigeoService = new UbigeoService();
    const { error, data } = await ubigeoService.getDistritos(ubigeoDep, ubigeoProv);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Distritos list Error', detail: 'Get distritos failed', life: 3000 });
      return;
    }

    setDistritos(data);
  }

  const searchDep = (event) => {
    setTimeout(() => {
      let _filteredDep;
      if (!event.query.trim().length) {
        _filteredDep = [...departamentos];
      }
      else {
        _filteredDep = filteredDep.filter((pat) => pat.label.toLowerCase().startsWith(event.query.toLowerCase()));
      }

      setFilteredDep(_filteredDep);
    }, 250);
  }

  const searchProv = (event) => {
    setTimeout(() => {
      let _filteredProv;
      if (!event.query.trim().length) {
        _filteredProv = [...provincias];
      }
      else {
        _filteredProv = filteredProv.filter((pat) => pat.label.toLowerCase().startsWith(event.query.toLowerCase()));
      }

      setFilteredProv(_filteredProv);
    }, 250);
  }

  const searchDis = (event) => {
    setTimeout(() => {
      let _filteredDis;
      if (!event.query.trim().length) {
        _filteredDis = [...distritos];
      }
      else {
        _filteredDis = filteredDis.filter((pat) => pat.label.toLowerCase().startsWith(event.query.toLowerCase()));
      }

      setFilteredDis(_filteredDis);
    }, 250);
  }

  const onSelectDep = (e) => {
    let _form = {...form};
    _form[`departamento`] = e.value.value;
    setForm(_form);
    setSelectedDep(e.value.label);
    setProvinciaData(e.value.value);
  }

  const onSelectProv = (e) => {
    let _form = {...form};
    _form[`provincia`] = e.value.value;
    setForm(_form);
    setSelectedProv(e.value.label);
    setDistritoData(form.departamento, e.value.value);
  }

  const onSelectDis = (e) => {
    let _form = {...form};
    _form[`distrito`] = e.value.value;
    setForm(_form);
    setSelectedDis(e.value.label);
  }

  return (
    <>
      { 
        currentStep === 2
        && 
        (
          <div className='third_step'>
            <div className='third_step-form'>
              <div className='nombre field'>
                <label htmlFor='nombres'>Nombre</label>
                <InputText id='nombres' value={form.nombres || ''} onChange={(e) => onInputChange(e, 'nombres')} required autoFocus className={classNames({ 'p-invalid': submitted && !form.nombres })} />
                {submitted && !form.nombres && <small className='p-error'>Nombre es requerido.</small>}
              </div>
              <div className='apepat field'>
                <label htmlFor='apePat'>Apellido Paterno</label>
                <InputText id='apePat' value={form.ape_paterno || ''} onChange={(e) => onInputChange(e, 'ape_paterno')} required className={classNames({ 'p-invalid': submitted && !form.ape_paterno })} />
                {submitted && !form.ape_paterno && <small className='p-error'>Apellido Paterno es requerido.</small>}
              </div>
              <div className='apemat field'>
                <label htmlFor='apeMat'>Apellido Materno</label>
                <InputText id='apeMat' value={form.ape_materno || ''} onChange={(e) => onInputChange(e, 'ape_materno')} required className={classNames({ 'p-invalid': submitted && !form.ape_materno })} />
                {submitted && !form.ape_materno && <small className='p-error'>Apellido Materno es requerido.</small>}
              </div>
              <div className='fnac field'>
                <label htmlFor='fecNac'>Fecha Nacimiento</label>
                <Calendar dateFormat='dd/mm/yy' id='fecNac' value={form.fec_nacimiento || ''} onChange={(e) => onInputChange(e, 'fec_nacimiento')} required className={classNames({ 'p-invalid': submitted && !form.fec_nacimiento })} showIcon />
                {submitted && !form.fec_nacimiento && <small className='p-error'>Fecha de Nacimiento es requerido.</small>}
              </div>
              <div className='depa field'>
                <label htmlFor='departamento'>Departamento</label>
                <AutoComplete dropdown forceSelection field='label' value={selectedDep} suggestions={filteredDep} completeMethod={searchDep} onChange={(e) => setSelectedDep(e.value)} onSelect={onSelectDep} aria-label='Departamentos'/>
              </div>
              <div className='prov field'>
                <label htmlFor='provincia'>Provincia</label>
                <AutoComplete dropdown forceSelection field='label' value={selectedProv} suggestions={filteredProv} completeMethod={searchProv} onChange={(e) => setSelectedProv(e.value)} onSelect={onSelectProv} aria-label='Provincias'/>
              </div>
              <div className='dist field'>
                <label htmlFor='distrito'>Distrito</label>
                <AutoComplete dropdown forceSelection field='label' value={selectedDis} suggestions={filteredDis} completeMethod={searchDis} onChange={(e) => setSelectedDis(e.value)} onSelect={onSelectDis} aria-label='Distritos'/>
              </div>
              <div className='tdoc field'>
                <label htmlFor='cod_tipo_doc'>Tipo Documento</label>
                <Dropdown optionLabel='label' optionValue='value' value={form.cod_tipo_doc || ''} options={tipoDocumento} onChange={(e) => onInputChange(e, 'cod_tipo_doc')} placeholder='Seleccionar'/>
              </div>
              <div className='ndoc field'>
                <label htmlFor='num_documento'>N° Documento</label>
                <InputText id='num_documento' value={form.num_documento || ''} onChange={(e) => onInputChange(e, 'num_documento')} required className={classNames({ 'p-invalid': submitted && !form.num_documento })} />
                {submitted && !form.num_documento && <small className='p-error'>Documento es requerido.</small>}
              </div>
              <div className='email field'>
                <label htmlFor='email'>Email</label>
                <InputText id='email' value={form.email || ''} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !form.email })} />
                {submitted && !form.email && <small className='p-error'>Email es requerido.</small>}
              </div>
              <div className='direc field'>
                <label htmlFor='direccion'>Dirección</label>
                <InputText id='direccion' value={form.direccion || ''} onChange={(e) => onInputChange(e, 'direccion')} required className={classNames({ 'p-invalid': false })} />
              </div>
              <div className='tel1 field'>
                <label htmlFor='telefono1'>Telefono 1</label>
                <InputText id='telefono1' value={form.telefono1 || ''} onChange={(e) => onInputChange(e, 'telefono1')} required className={classNames({ 'p-invalid': false })} />
              </div>
              <div className='tel2 field'>
                <label htmlFor='telefono2'>Telefono 2</label>
                <InputText id='telefono2' value={form.telefono2 || ''} onChange={(e) => onInputChange(e, 'telefono2')} required className={classNames({ 'p-invalid': false })} />
              </div>
            </div>
            <div className='third_step-button'>
              <Button label='Anterior' onClick={previousButton} />
              <Button label='Registrar solicitud' onClick={nextButton} />
            </div>
          </div>
        )
      }
    </>
  )
}

export default ThirdStep;
