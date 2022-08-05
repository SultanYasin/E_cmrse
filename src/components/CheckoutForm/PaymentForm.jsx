
import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout }) => {
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    if (error) {
      console.log('[error]', error);
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
        shipping: { name: 'International', street: shippingData.address1, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };

      onCaptureCheckout(checkoutToken.id, orderData);

      nextStep();
    }
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>{({ elements, stripe }) => (
          <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
            <CardElement />
            <br /> <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={backStep}>Back</Button>
              <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                Pay {checkoutToken.live.subtotal.formatted_with_symbol}
              </Button>
            </div>
          </form>
        )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;


/*
import React from 'react'
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

const stripePromise = loadStripe('process.env.REACT_APP_MY_STRIPE_PUBLIC_KEY')
export default function PaymentForm(checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout) {

  const handleSubmit = async (event, elements, stripe) => {
    // to prevent the browser to refresh the page
    event.preventDefault(); 
   
    if( !stripe || !elements ) return;

    // the one inside the perenthesis is the imported from @stripe/react-stripe-js
    const cardElement = elements.getElement(CardElement); 

    // use strip api to create a new payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    if (error) {
       console.log('[error]', error);
    } else {
      //in here I gather all data that I collect form the agent and send to  commerse.js(backend)
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: {firstname: shippingData.firstName ,lastname: shippingData.lastName, email: shippingData.email}, // bringing the customer info from the address form
        shipping: {
          name: "Primary",
          street: shippingData.address1,
          town_city: shippingData.city,
          country_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.shippingCountry,
        },
        fulfillment: {shipping_method: shippingData.shippingOption},
        payment: { gateway: 'stripe', stripe:{payment_method_id: paymentMethod.id }
        }
      }
      onCaptureCheckout(checkoutToken.id , orderData)
      nextStep(); // takes me a step ferther
    }

  }

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant='h6' gutterBottom style={{margin:'20px 0'}}> Payment methode </Typography>
      <ElementsConsumer>
          {({elements, stripe})=>(
        <form  onSubmit={(event) => handleSubmit(event , elements , stripe)}>
              <CardElement/>
              <br/><br/>
              <div style={{display: 'flex' , justifyContent:'space-between'}}>
                <Button variant='outlined' onClick={backStep} >Back</Button>
                <Button variant='contained' color='primary' type='submit' disabled={!stripe} color="primary" >
                  {/* taking the amount of shopped staff from checkoutToken }
                  Pay {checkoutToken.live.total.formatted_with_symbol}
                </Button>
              </div>
        </form>
          )}
      </ElementsConsumer>

    </>
  );
}
*/
