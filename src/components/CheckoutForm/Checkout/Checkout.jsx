
import React from 'react'
import {Paper , Stepper , Step , Typography , CircularProgress , Divider , Button, StepLabel} from '@material-ui/core';

import {commerce} from '../../lib/commerce';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { useEffect , useState} from 'react';


export default function Checkout( {cart} ) {
  const [activeStep , setActiveStep] = React.useState(1);
  const [checkoutToken, setCheckoutToken] = useState(null)
  const classes = useStyles();

  // as soon as someone enter into the checkout process, a new checkout token will be generated 
  // the generateToken function is already exists in the backend
  useEffect(() => {
    if (cart.id) {
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

          setCheckoutToken(token);
        } catch {
         // if (activeStep !== steps.length) history.push('/');
        }
      };

      generateToken(); // in useEffect I can not use async unless it's a new function
    }
  }, [cart]); // as soon as the cart is been chenged then recall the generateToken function to generate a new token

  const steps = ['Shippong adress', 'Payment details'];
                                  // passing the checkout token to the address form
  const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken}/> :<PaymentForm />; 

  const Confirmation = () => (<div>Confirmation</div>);

  return (
    <>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (<Step key={step}> <StepLabel> {step} </StepLabel> </Step>))}
          </Stepper>
     {/* in this case , at this point we still didnt call the checkoutToken so i still don't have it
      while the address is depends on it. in this case I wanna add one more check to show this form by checkoutToken && <Form /> 
      so. ONLY when I have the checkouToken  you can render the form */}
          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form /> }

        </Paper>
      </main>
    </>
  );
}


// Steps the steps is the trucker that track the order when status
// paper is an item that can wrapp a component and it's only give it a bgcolor

// rendering 2 diffrent componentes depending in in which step I am currently on ->
/* const form = () => activeStep === 0 ? <AddressForm /> : <PaymentForm /> 
-> that means if the current position is the first step then show the  adress from otherwise 
(if the current position is not 0 that means I am a step ferther and I should fill the payment from)  

_______

{activeStep === steps.length ? <Confirmation/> : <Form/>} if activeStep is in the last step then show the confirmation

*/



















/*
import React, { useState, useEffect } from 'react';
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import { commerce } from '../../../lib/commerce';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, onCaptureCheckout, order, error }) => {
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();
  const history = useHistory();

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  useEffect(() => {
    if (cart.id) {
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

          setCheckoutToken(token);
        } catch {
          if (activeStep !== steps.length) history.push('/');
        }
      };

      generateToken();
    }
  }, [cart]);

  const test = (data) => {
    setShippingData(data);

    nextStep();
  };

  let Confirmation = () => (order.customer ? (
    <>
      <div>
        <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
      </div>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
    </>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  ));

  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
      </>
    );
  }

  const Form = () => (activeStep === 0
    ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} test={test} />
    : <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} />);

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
*/
