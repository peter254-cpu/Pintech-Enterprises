import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupons.model.js";
import Order from "../models/order.model.js"

async function createStripeCoupon(discountPercentage) {
  // Create a coupon with the specified discount percentage
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  // Return the coupon ID
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({userId: userId })
  // Check if the user already has an active coupon
  const existingCoupon = await Coupon.findOne({ userId: userId, isActive: true });
  if (existingCoupon) {
    // If an active coupon already exists, return it
    return existingCoupon;
  }
  // Generate a new coupon code
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10, // Set discount percentage
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set expiration date to 30 days from today
    userId: userId, // Associate the coupon with the user
  });
  // Save the new coupon to the database
  await newCoupon.save();
  // Return the new coupon
  return newCoupon;
}

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    // Validate the products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }
    let totalAmount = 0;
    // Create line items for Stripe checkout session
    const lineItems = products.map((product) => {
      const amount = product.price * 100; // Stripe requires amount in cents
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image], // Add product image
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    let coupon = null;
    // Check if coupon code is provided and active
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      // Apply coupon discount if valid
      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }
    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    // Check total amount and create a new coupon if necessary
    if (totalAmount >= 20000) { // Total amount in cents (200 USD)
      await createNewCoupon(req.user._id);
    }
    // Respond with the session ID and total amount
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.log("Error creating checkout session", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment was successful
    if (session.payment_status === "paid") {
      // Deactivate the coupon if it was used
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId, // Ensure the userId is correctly matched
          },
          {
            isActive: false,
          }
        );
      }

      // Check for existing order with the same stripeSessionId
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
      if (existingOrder) {
        return res.status(400).json({ message: "Order already processed for this session." });
      } else {
        // Parse the products from the session metadata
        const products = JSON.parse(session.metadata.products);

        // Create a new order with the provided details
        const newOrder = new Order({
          user: session.metadata.userId,
          products: products.map((product) => ({
            product: product.id,
            quantity: product.quantity,
            price: product.price,
          })),
          totalAmount: session.amount_total / 100, // Convert total amount from cents to USD
          paymentIntent: session.payment_intent,
          stripeSessionId: sessionId,
        });

        // Save the new order to the database
        await newOrder.save();

        // Respond with a success message and the new order ID
        res.status(200).json({
          success: true,
          message: "Payment successful, order created, and coupon deactivated if used",
          orderId: newOrder._id,
        });
      }
    } else {
      // Respond with an error message if the payment was not successful
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    // Log the error and respond with an error message
    console.log("Error at success checkout", error.message);

    // Handle duplicate key error for stripeSessionId
    if (error.code === 11000 && error.keyPattern && error.keyPattern.stripeSessionId) {
      return res.status(400).json({ message: "Order already processed for this session." });
    }

    res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};
