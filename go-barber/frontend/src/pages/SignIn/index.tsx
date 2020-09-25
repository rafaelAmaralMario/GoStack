import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Background } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('Email is Mandatory')
          .email('Enter a valid Email'),
        password: Yup.string().required('Password is mandatory'),
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
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Login</h1>

          <Input icon={FiMail} name="email" type="text" placeholder="E-mail" />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Login</Button>

          <a href="forgot">Forgot my password</a>
        </Form>

        <a href="create-account">
          <FiLogIn />
          Create Account
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
