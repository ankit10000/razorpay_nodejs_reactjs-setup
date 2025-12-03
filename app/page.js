'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function PaymentPage() {
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);
  const [amount, setAmount] = useState(0);
  const router = useRouter();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amt) => {
    try {
      setAmount(amt);
      const response = await axios.post("/api/orders", {
        amount: amt * 100,
        currency: "INR",
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("Order Response:", response.data.amount);
      handleRazorpayScreen(response.data.amount);

    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    }
  };

  const handleRazorpayScreen = async (amt) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Some error at Razorpay screen loading");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amt,
      currency: 'INR',
      name: "Happy Coders",
      description: "Payment to Happy Coders",
      image: "https://papayacoders.com/demo.png",
      handler: async function (response) {
        setResponseId(response.razorpay_payment_id);

        try {
          const captureResponse = await axios.post(
            `/api/capture/${response.razorpay_payment_id}`,
            { amount: amt },
            { headers: { 'Content-Type': 'application/json' } }
          );

          console.log("Capture Response:", captureResponse.data);

          router.push("/success");
        } catch (error) {
          console.error("Error capturing payment:", error);
        }
      },
      prefill: {
        name: "Happu",
        email: "0000ankit0000jangid@gmail.com"
      },
      theme: {
        color: "#F2C830"
      },
      modal: {
        ondismiss: function () {
          router.push("/canceled");
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const paymentFetch = (e) => {
    e.preventDefault();
    const paymentId = e.target.paymentId.value;

    axios.get(`/api/payment/${paymentId}`)
      .then((response) => {
        console.log(response.data);
        setResponseState(response.data);
      })
      .catch((error) => {
        console.log("Error occurs", error);
      });
  };

  useEffect(() => {
    if (!responseId) return;

    let data = JSON.stringify({
      amount: amount * 100,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `/api/capture/${responseId}`,
      headers: { 'Content-Type': 'application/json' },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log("Error at", error);
      });
  }, [responseId, amount]);

  return (
    <div className="App">
      <h1>Razorpay Payment Gateway</h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#333', fontSize: '1.8rem', marginBottom: '15px', textAlign: 'center' }}>Make a Payment</h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '25px' }}>
          Click below to proceed with secure payment
        </p>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => createRazorpayOrder(100)}>
            💳 Pay ₹100
          </button>
        </div>
        {responseId && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center',
            animation: 'slideInUp 0.5s ease-out'
          }}>
            <strong>Payment ID:</strong> {responseId}
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ color: '#333', fontSize: '1.8rem', marginBottom: '15px', textAlign: 'center' }}>
          Verify Payment
        </h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '25px' }}>
          Enter payment ID to check transaction status
        </p>
        <form onSubmit={paymentFetch} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            name="paymentId"
            placeholder="Enter Payment ID"
            style={{ marginBottom: '15px' }}
          />
          <button type="submit">🔍 Fetch Payment Details</button>

          {responseState.length !== 0 && (
            <div style={{
              marginTop: '25px',
              width: '100%',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '16px',
              padding: '25px',
              animation: 'slideInUp 0.6s ease-out'
            }}>
              <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.3rem' }}>
                Payment Details
              </h3>
              <ul style={{ textAlign: 'left' }}>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px 0'
                }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>Amount:</span>
                  <span style={{ color: '#333', fontWeight: '700' }}>₹{responseState.amount / 100}</span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px 0'
                }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>Currency:</span>
                  <span style={{ color: '#333' }}>{responseState.currency}</span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px 0'
                }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>Status:</span>
                  <span style={{
                    color: responseState.status === 'captured' ? '#10b981' : '#f59e0b',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem'
                  }}>
                    {responseState.status}
                  </span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px 0',
                  borderBottom: 'none'
                }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>Method:</span>
                  <span style={{ color: '#333' }}>{responseState.method}</span>
                </li>
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
