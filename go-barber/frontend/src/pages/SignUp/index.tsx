import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';

import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import api from '../../services/apiClient';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
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

        await api.post('/users', data);
        addToast({
          type: 'success',
          title: 'User Created Successfully.',
        });
        history.push('/');
      } catch (errors) {
        if (errors instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(errors);
          formRef.current?.setErrors(validationErrors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Error on Create User',
          description: 'Error on Create User.',
        });
      }
    },
    [history, addToast],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create New Account</h1>

            <Input icon={FiUser} name="name" type="text" placeholder="Name" />
            <Input
              icon={FiMail}
              name="email"
              type="text"
              placeholder="E-mail"
            />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Register</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Back To Login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
