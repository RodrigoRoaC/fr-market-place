import React, { useContext, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { TabView, TabPanel } from 'primereact/tabview';
 
import './LoginForm.css';
import { UserContext } from '../../context/UserContext';
import { AuthService } from '../../services/Auth/AuthService';

export const LoginForm = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [showError, setShowError] = useState(false);
    const [formData, setFormData] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);

    const { setUser } = useContext(UserContext);

    const validate = (data) => {
        let errors = {};

        if (!data.username) {
            errors.username = 'Username is required.';
        }

        if (!data.clave) {
            errors.clave = 'Clave is required.';
        }

        return errors;
    };

    const onSubmit = async (data, form) => {
        const authService = new AuthService();
        const loginResponse = await authService.authenticate(data);
        if (loginResponse.error) {
            setShowError(true);
            return;
        }
        setUser(loginResponse.data);
        setFormData(data);
        setShowMessage(true);
        form.restart();
    };

    const onSubmit1 = async (data, form) => {
        const authService = new AuthService();
        console.log("Entro!");
        const loginResponse = await authService.authenticate(data);
        if (loginResponse.error) {
            setShowError(true);
            return;
        }
        setUser(loginResponse.data);
        setFormData(data);
        setShowMessage(true);
        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;
    const dialogErrorFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowError(false) } /></div>;

    return (
        <div className="register-form">
            <div className="container">
                <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                    <div className="flex align-items-center flex-column pt-6 px-3">
                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                        <h5>Login Successful!</h5>
                        <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                            Welcome <b>{formData.username}</b>
                        </p>
                    </div>
                </Dialog>
                <Dialog visible={showError} onHide={() => setShowError(false)} position="top" footer={dialogErrorFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                    <div className="flex align-items-center flex-column pt-6 px-3">
                        <i className="pi pi-times" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                        <h5>Login Error!</h5>
                        <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                            Wrong credentials
                        </p>
                    </div>
                </Dialog>

                <div className="flex justify-content-center">
                    <div className="card">
                    <h2 className="text-center">Ingresar al sistema</h2>
                        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                            <TabPanel header="Usuario Registrado">
                                <Form onSubmit={onSubmit} initialValues={{ username: '', clave: '' }} validate={validate} render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit} className="p-fluid">
                                        <Field name="username" render={({ input, meta }) => (
                                            <div className="field mt-2">
                                                <span className="p-float-label">
                                                    <InputText id="username" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="username" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Usuario*</label>
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )} />
                                        <Field name="clave" render={({ input, meta }) => (
                                            <div className="field mt-2">
                                                <span className="p-float-label">
                                                    <Password id="clave" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} feedback={false} />
                                                    <label htmlFor="clave" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Clave*</label>
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )} />

                                        <Button type="submit" label="Ingresar" className="mt-2" />
                                    </form>
                                )} />
                            </TabPanel>
                            <TabPanel header="Usuario No Registrado">
                                <Form onSubmit={onSubmit1} initialValues={{ num_documento: '', fec_nacimiento: '' }} validate={validate} render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit} className="p-fluid">
                                        <Field name="num_documento" render={({ input, meta }) => (
                                            <div className="field mt-2">
                                                <span className="p-float-label p-input-icon-right">
                                                    <InputText id="num_documento" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="num_documento" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Numero de documento*</label>
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )} />
                                        <Field name="fec_nacimiento" render={({ input }) => (
                                            <div className="field mt-2">
                                                <span className="p-float-label">
                                                    <Calendar id="fec_nacimiento" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                                    <label htmlFor="fec_nacimiento">Fecha de nacimiento</label>
                                                </span>
                                            </div>
                                        )} />

                                        <Button type="submit" label="Ingresar" className="p-button p-component mt-2" />
                                    </form>
                                )} />
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    );
}
