import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import Auth from '../utils/auth';

// Define your GraphQL mutation
const SIGN_UP_USER = gql`
  mutation SignUpUser($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [signUpUser, { loading, error }] = useMutation(SIGN_UP_USER, {
    onCompleted: data => {
      localStorage.setItem('id_token', data.signUp.token);
      Auth.login(data.signUp.token);
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await signUpUser({
        variables: { ...userFormData }
      });
      setShowAlert(false);
    } catch (e) {
      console.error(e);
      setShowAlert(true);
    }

    setUserFormData({ username: '', email: '', password: '' });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert || error} variant='danger'>
          Something went wrong with your signup! {error && <span>{error.message}</span>}
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            value={userFormData.username}
            onChange={handleInputChange}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            value={userFormData.email}
            onChange={handleInputChange}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
          type='password'
          placeholder='Your password'
          name='password'
          value={userFormData.password}
          onChange={handleInputChange}
          required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button disabled={loading || !(userFormData.username && userFormData.email && userFormData.password)} type='submit' variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;