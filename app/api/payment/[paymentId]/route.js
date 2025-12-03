import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET(request, { params }) {
  try {
    const { paymentId } = await params;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment = await razorpay.payments.fetch(paymentId);

    if (!payment) {
      return NextResponse.json(
        { error: "Error at razorpay loading" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}
