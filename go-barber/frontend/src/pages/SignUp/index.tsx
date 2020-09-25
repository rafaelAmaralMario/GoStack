import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is Mandatory'),
        email: Yup.string()
          .required('Email is Mandatory')
          .email('Enter a valid Email'),
        password: Yup.string().min(6, 'Your password need 6 digits at least'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (errors) {
      const validationErrors = getValidationErrors(errors);
      formRef.current?.setErrors(validationErrors);
    }
  }, []);

  return (
    <Container>
      <Background />

      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Create New Account</h1>

          <Input icon={FiUser} name="name" type="text" placeholder="Name" />
          <Input icon={FiMail} name="email" type="text" placeholder="E-mail" />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Register</Button>
        </Form>

        <a href="create-account">
          <FiArrowLeft />
          Back To Login
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
