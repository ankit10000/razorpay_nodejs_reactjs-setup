import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request, { params }) {
  try {
    const { paymentId } = await params;
    const body = await request.json();
    const { amount } = body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const response = await razorpay.payments.capture(paymentId, amount, 'INR');

    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
